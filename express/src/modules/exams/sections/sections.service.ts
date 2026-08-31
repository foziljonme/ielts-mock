import db from "@/config/db";
import {
  ExamSeatStatus,
  ExamStatus,
  TestSkill,
} from "../../../../prisma/generated/enums";
import { NotFoundError } from "@/shared/utils/errors/NotFoundError";
import { Prisma } from "../../../../prisma/generated/client";
import { BadRequest } from "@/shared/utils/errors/BadRequest";
import { ConflictError } from "@/shared/utils/errors/ConflictError";
import examService from "../exams.service";
import { AuthRequestContext } from "@/modules/auth/auth.types";

class SectionsService {
  constructor() {}

  async createSections(tx: Prisma.TransactionClient, examId: string) {
    const sections = [
      TestSkill.LISTENING,
      TestSkill.READING,
      TestSkill.WRITING,
      TestSkill.SPEAKING,
    ];
    const createData = sections.map((section, idx) => ({
      examId,
      section,
      // status: .NOT_STARTED,
      order: idx + 1,
    }));
    const examSections = await tx.examSection.createManyAndReturn({
      data: createData,
    });

    return examSections;
  }

  async startSection(
    ctx: AuthRequestContext,
    examId: string,
    skill: TestSkill,
  ) {
    return await db.$transaction(async (tx) => {
      const exam = await examService.getExamById(tx, ctx, examId, true);

      if (!exam || exam.status == ExamStatus.SCHEDULED) {
        throw new BadRequest(
          "Exam is not started yet, please make sure to start the exam and log in the candidates before starting a section",
        );
      }

      console.log("exam.examSectionProgresses", exam.examSectionProgresses);

      const section = exam.examSectionProgresses.find(
        (s) => s.skill.toUpperCase() === skill.toUpperCase(),
      );

      console.log("sectionnnn", section);
      if (!section || section?.status === ExamStatus.IN_PROGRESS) {
        throw new ConflictError("Section already in progress");
      }

      if (!section || section?.status === ExamStatus.COMPLETED) {
        throw new BadRequest("Section already completed");
      }

      const updatedProgress = await tx.examSectionProgress.update({
        where: {
          id: section.id,
        },
        data: {
          status: ExamStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
      });

      await tx.exam.update({
        where: { id: examId },
        data: {
          status: ExamStatus.IN_PROGRESS,
          currentSkill: skill,
        },
      });

      const seats = await tx.examSeat.updateManyAndReturn({
        where: { examId },
        data: { status: ExamSeatStatus.IN_PROGRESS },
      });

      const testSectionId = exam.test.sections.find(
        (s) => s.skill === skill,
      )?.id;

      await tx.sectionProgress.createMany({
        data: seats.map((s) => ({
          sectionId: testSectionId!,
          seatId: s.id,
          examId,
          skill,
        })),
      });

      return updatedProgress;
    });
  }

  async getSection(
    tx: Prisma.TransactionClient,
    examId: string,
    skill: TestSkill,
  ) {
    const section = await tx.exam.findUnique({
      where: {
        id: sectionId,
        examId: examId,
      },
    });

    console.log("sectionn", section, examId);

    if (!section || section?.examId != examId) {
      throw new NotFoundError("Section with such id does not exist");
    }

    return section;
  }
}

const sectionsService = new SectionsService();
export default sectionsService;
