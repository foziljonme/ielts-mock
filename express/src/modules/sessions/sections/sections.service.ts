import db from "@/config/db";
import {
  ExamSessionProgressStatus,
  TestSection,
} from "../../../../prisma/generated/enums";
import { NotFoundError } from "@/shared/utils/errors/NotFoundError";
import { Prisma } from "../../../../prisma/generated/client";
import { BadRequest } from "@/shared/utils/errors/BadRequest";

class SectionsService {
  constructor() {}

  async startSection(sessionId: string, sectionId: TestSection) {
    return await db.$transaction(async (tx) => {
      const progress = await this.getSessionProgress(tx, sessionId, sectionId);

      if (!progress) {
        throw new NotFoundError("Session or section not found");
      }

      if (progress.status === ExamSessionProgressStatus.IN_PROGRESS) {
        throw new BadRequest("Section already in progress");
      }

      if (progress.status === ExamSessionProgressStatus.COMPLETED) {
        throw new BadRequest("Section already completed");
      }

      const updatedProgress = await tx.examSessionProgress.update({
        where: {
          sessionId_section: {
            sessionId,
            section: sectionId,
          },
        },
        data: {
          status: ExamSessionProgressStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
      });

      return updatedProgress;
    });
  }

  async getSessionProgress(
    tx: Prisma.TransactionClient,
    sessionId: string,
    sectionName: TestSection,
  ) {
    const progress = await tx.examSessionProgress.findUnique({
      where: {
        sessionId_section: {
          sessionId,
          section: sectionName,
        },
      },
    });
    return progress;
  }
}

const sectionsService = new SectionsService();
export default sectionsService;
