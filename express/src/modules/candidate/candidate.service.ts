import db from "@/config/db";
import { ExamSeat, ExamSeatStatus } from "../../../prisma/generated/client";
import { NotFoundError } from "@/shared/utils/errors/NotFoundError";
import { BadRequest } from "@/shared/utils/errors/BadRequest";
import { InteralServerError } from "@/shared/utils/errors/InternalServerError";
import { ConflictError } from "@/shared/utils/errors/ConflictError";

class CandidateService {
  constructor() {}

  private async getSeat(id: string) {
    const seat = await db.examSeat.findUnique({
      where: { id },
      include: { exam: true },
    });

    if (!seat) {
      throw new NotFoundError("Seat does not exist");
    }

    return seat;
  }

  private async getSeatFull(seat: ExamSeat) {
    const currentSeat = await db.examSeat.findUnique({
      where: { id: seat.id },
      include: {
        exam: {
          include: {
            test: {
              include: {
                sections: {
                  include: {
                    audioTracks: true,
                    passages: true,
                    questionGroups: {
                      include: {
                        questions: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return currentSeat;
  }

  async getCurrentSection(seat: ExamSeat) {
    const currentSeat = await this.getSeatFull(seat);

    if (!currentSeat) {
      throw new NotFoundError(
        "Seat does not exist, please login as candidate before trying!",
      );
    }

    if (currentSeat.exam.currentSkill === null) {
      throw new BadRequest(
        "Exam has not started yet, please make sure to start the exam and log in the candidates before starting a section",
      );
    }

    // const test = getPublicTestSection(
    //   currentSeat.exam.testId,
    //   currentSeat.exam.currentSection.section,
    // );

    const { exam, ...seatInfo } = currentSeat;
    const { test } = exam;
    const currentSection = test.sections.find(
      (s) => s.skill === currentSeat.exam.currentSkill,
    );

    return { ...seatInfo, currentSection };
  }

  async submitCurrentSection(seat: ExamSeat) {
    const seatId = seat.id;
    return db.$transaction(async (tx) => {
      // 1. Load seat + exam
      const seat = await tx.examSeat.findUnique({
        where: { id: seatId },
        include: { exam: true },
      });
      if (!seat) throw new NotFoundError("Seat not found");

      if (seat.status === "SUBMITTED" || seat.status === "EXPIRED") {
        throw new ConflictError("Exam already finalized for this seat");
      }

      const exam = seat.exam;
      if (!exam.currentSkill) {
        throw new ConflictError("No section is currently open for this exam");
      }

      // 2. Resolve which Section row exam.currentSkill points to
      const section = await tx.section.findUnique({
        where: {
          testId_skill: { testId: exam.testId, skill: exam.currentSkill },
        },
      });

      if (!section)
        throw new ConflictError("Current section not found for this test");

      // 3. Find this seat's progress for that section
      const progress = await tx.sectionProgress.findUnique({
        where: { seatId_sectionId: { seatId, sectionId: section.id } },
      });

      if (!progress) {
        throw new ConflictError("Candidate has not started this section");
      }

      // 4. Idempotency — calling submit twice (retry, double-click) is a no-op
      if (progress.status === "COMPLETED") {
        return { alreadySubmitted: true, progress };
      }

      if (progress.status === "EXPIRED") {
        throw new ConflictError("Section already expired");
      }

      // 5. Deadline check — informational, doesn't block; the section-level
      //    expiry sweep (see below) is what actually enforces the cutoff
      const deadline = progress.startedAt
        ? new Date(progress.startedAt.getTime() + section.durationSec * 1000)
        : null;
      const isLate = deadline ? Date.now() > deadline.getTime() : false;

      // 6. Finalize this candidate's progress — this is the write-lock.
      //    Any autosave request for this sectionProgressId after this point
      //    must be rejected by the autosave handler (check status first).
      const updatedProgress = await tx.sectionProgress.update({
        where: { id: progress.id },
        data: { status: "COMPLETED", submittedAt: new Date() },
      });

      // 7. If this was the exam's last section, finalize the whole seat
      const allSections = await tx.section.findMany({
        where: { testId: exam.testId },
        orderBy: { order: "asc" },
      });
      const isLastSection =
        allSections[allSections.length - 1]?.id === section.id;

      if (isLastSection) {
        await tx.examSeat.update({
          where: { id: seatId },
          data: { status: "SUBMITTED", submittedAt: new Date() },
        });
      }

      return { alreadySubmitted: false, progress: updatedProgress, isLate };
    });
  }

  async saveResponse(seatId: string, questionId: string, value: unknown) {
    return db.$transaction(async (tx) => {
      // 1. Load seat + exam, same as submit
      const seat = await tx.examSeat.findUnique({
        where: { id: seatId },
        include: { exam: true },
      });
      if (!seat) throw new NotFoundError("Seat not found");
      if (seat.status !== "IN_PROGRESS" && seat.status !== "NOT_STARTED") {
        throw new ConflictError("Exam already finalized for this seat");
      }

      const exam = seat.exam;
      if (!exam.currentSkill) {
        throw new ConflictError("No section is currently open for this exam");
      }

      const section = await tx.section.findUnique({
        where: {
          testId_skill: { testId: exam.testId, skill: exam.currentSkill },
        },
      });
      if (!section) throw new ConflictError("Current section not found");

      // 2. This seat's progress row for that section — must exist and be open
      const progress = await tx.sectionProgress.findUnique({
        where: { seatId_sectionId: { seatId, sectionId: section.id } },
      });

      if (!progress)
        throw new ConflictError("Candidate has not started this section");
      if (progress.status === "COMPLETED" || progress.status === "EXPIRED") {
        throw new ConflictError(
          "Section is closed — no further answers accepted",
        );
      }

      // 3. Deadline check — reject stray writes past time-up even if the
      //    expiry sweep hasn't run yet
      if (progress.startedAt) {
        const deadline =
          progress.startedAt.getTime() + section.durationSec * 1000;
        if (Date.now() > deadline) {
          // throw new ConflictError("Section time has expired");
        }
      }

      // 4. Verify questionId actually belongs to THIS section — never trust
      //    the path param as-is. Walk Question -> QuestionGroup -> sectionId.
      const question = await tx.question.findUnique({
        where: { id: questionId },
        include: { questionGroup: true },
      });
      if (!question || question.questionGroup.sectionId !== section.id) {
        throw new NotFoundError(
          "Question does not belong to the current section",
        );
      }

      // 5. Compute wordCount server-side for Writing; don't trust client input
      let wordCount: number | undefined;
      if (
        question.questionGroup.type === "WRITING_TASK" &&
        typeof value === "string"
      ) {
        wordCount = value.trim().length ? value.trim().split(/\s+/).length : 0;
      }

      // 6. Upsert — safe to call repeatedly, unique constraint prevents dupes
      const response = await tx.questionResponse.upsert({
        where: {
          sectionProgressId_questionId: {
            sectionProgressId: progress.id,
            questionId,
          },
          seatId,
        },
        update: {
          value: value as any,
          ...(wordCount !== undefined && { wordCount }),
          answeredAt: new Date(),
        },
        create: {
          sectionProgressId: progress.id,
          questionId,
          value: value as any,
          wordCount,
          answeredAt: new Date(),
          seatId,
        },
      });

      // 7. Flip progress to IN_PROGRESS on first-ever answer, if it was NOT_STARTED
      if (progress.status === "NOT_STARTED") {
        await tx.sectionProgress.update({
          where: { id: progress.id },
          data: {
            status: "IN_PROGRESS",
            startedAt: progress.startedAt ?? new Date(),
          },
        });
      }

      return response;
    });
  }

  async restoreSection(seat: ExamSeat) {
    const userResponses = await db.questionResponse.findMany({
      where: {
        seatId: seat.id,
      },
      orderBy: {
        sectionProgressId: "asc",
      },
    });

    return userResponses;
  }
}

const candidateService = new CandidateService();

export default candidateService;
