import db from "@/config/db";
import {
  ExamSectionStatus,
  TestSection,
} from "../../../../prisma/generated/enums";
import { NotFoundError } from "@/shared/utils/errors/NotFoundError";
import { Prisma } from "../../../../prisma/generated/client";
import { BadRequest } from "@/shared/utils/errors/BadRequest";

class SectionsService {
  constructor() {}

  async startSection(examId: string, sectionId: string) {
    return await db.$transaction(async (tx) => {
      const section = await this.getSection(tx, examId, sectionId);

      if (!section) {
        throw new NotFoundError("Exam or section not found");
      }

      if (section.status === ExamSectionStatus.IN_PROGRESS) {
        throw new BadRequest("Section already in progress");
      }

      if (section.status === ExamSectionStatus.COMPLETED) {
        throw new BadRequest("Section already completed");
      }

      const updatedProgress = await tx.examSection.update({
        where: {
          id: sectionId,
        },
        data: {
          status: ExamSectionStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
      });

      return updatedProgress;
    });
  }

  async getSection(
    tx: Prisma.TransactionClient,
    examId: string,
    sectionId: string,
  ) {
    const section = await tx.examSection.findUnique({
      where: {
        id: sectionId,
      },
    });

    if (!section || section?.examId != examId) {
      throw new NotFoundError("Section with such id does not exist");
    }

    return section;
  }

  async createSections(tx: Prisma.TransactionClient, examId: string) {
    const sections = [
      TestSection.LISTENING,
      TestSection.READING,
      TestSection.WRITING,
      TestSection.SPEAKING,
    ];
    const createData = sections.map((section) => ({
      examId,
      section,
      status: ExamSectionStatus.NOT_STARTED,
    }));
    const examSections = await tx.examSection.createManyAndReturn({
      data: createData,
    });

    return examSections;
  }
}

const sectionsService = new SectionsService();
export default sectionsService;
