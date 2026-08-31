import { AuthRequestContext } from "../auth/auth.types";
import db from "../../config/db";
import { CreateExamSchema, UpdateExamSchema } from "./exam.schema";
import examSeatsService from "./seats/seat.service";
import { AppError } from "@/shared/utils/errors";
import { ErrorCodes } from "@/shared/utils/errors/codes";
import {
  Exam,
  ExamStatus,
  Prisma,
  TestSkill,
} from "../../../prisma/generated/client";
import sectionsService from "./sections/sections.service";

type ExamFullInfo = Prisma.ExamGetPayload<{
  include: {
    test: {
      include: {
        sections: true;
      };
    };
    examSectionProgresses: true;
    seats: true;
  };
}>;

class ExamService {
  constructor() {}

  async createExam(ctx: AuthRequestContext, data: CreateExamSchema) {
    return db.$transaction(async (tx) => {
      const { seats: seatsData, ...examData } = data;
      const exam = await tx.exam.create({
        data: { ...examData, tenantId: ctx.user.tenantId },
        include: {
          test: {
            include: {
              sections: true,
            },
          },
        },
      });

      const seats = await examSeatsService.createSeats(
        ctx,
        tx,
        exam.id,
        seatsData,
      );
      const skillsList = Object.values(TestSkill);
      const examSectionProgresses =
        await tx.examSectionProgress.createManyAndReturn({
          data: skillsList.map((s) => ({
            examId: exam.id,
            status: ExamStatus.SCHEDULED,
            skill: s,
          })),
        });

      // const sections = await sectionsService.createSections(tx, exam.id);
      const { test, ...rest } = exam;
      return { ...rest, test, examSectionProgresses, seats };
    });
  }

  async listExams(ctx: AuthRequestContext, page: number, pageSize: number) {
    const [items, totalItems] = await db.$transaction([
      db.exam.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: { tenantId: ctx.user.tenantId },
        orderBy: { createdAt: "desc" },
        include: {
          seats: {
            include: {
              sections: true,
            },
          },
          test: {
            include: {
              sections: true,
            },
          },
        },
      }),
      db.exam.count({ where: { tenantId: ctx.user.tenantId } }),
    ]);

    return { items, totalItems };
  }

  // Overload: true => full info
  getExamById(
    tx: Prisma.TransactionClient,
    ctx: AuthRequestContext,
    examId: string,
    includeFullInfo: true,
  ): Promise<ExamFullInfo>;

  // Overload: false or omitted => plain Exam
  getExamById(
    tx: Prisma.TransactionClient,
    ctx: AuthRequestContext,
    examId: string,
    includeFullInfo?: false,
  ): Promise<Exam>;

  // Implementation — must accept boolean
  async getExamById(
    tx: Prisma.TransactionClient,
    ctx: AuthRequestContext,
    examId: string,
    includeFullInfo: boolean = false,
  ): Promise<Exam | ExamFullInfo> {
    const where = {
      id: examId,
      tenantId: ctx.user.tenantId,
    };

    const exam = includeFullInfo
      ? await tx.exam.findUnique({
          where,
          include: {
            test: {
              include: {
                sections: true,
              },
            },
            examSectionProgresses: true,
            seats: true,
          },
        })
      : await tx.exam.findUnique({
          where,
        });

    if (!exam) {
      throw new AppError(
        "Exam not found",
        404,
        ErrorCodes.NOT_FOUND,
        "Exam not found, please check the exam id",
      );
    }

    return exam;
  }

  async getExamByIdWithTx(ctx: AuthRequestContext, examId: string) {
    return db.$transaction(async (tx) => {
      return this.getExamById(tx, ctx, examId, true);
    });
  }

  async updateExam(
    ctx: AuthRequestContext,
    examId: string,
    data: UpdateExamSchema,
  ) {
    return db.$transaction(async (tx) => {
      await this.getExamById(tx, ctx, examId);

      const exam = await tx.exam.update({
        where: { id: examId, tenantId: ctx.user.tenantId },
        // @ts-expect-error
        data,
      });
      return exam;
    });
  }

  async archiveExam(ctx: AuthRequestContext, examId: string) {
    return db.$transaction(async (tx) => {
      await this.getExamById(tx, ctx, examId);

      const exam = await tx.exam.update({
        where: { id: examId, tenantId: ctx.user.tenantId },
        data: { isArchived: true },
      });
      return exam;
    });
  }

  async deleteExam(ctx: AuthRequestContext, examId: string) {
    return db.$transaction(async (tx) => {
      await this.getExamById(tx, ctx, examId);

      const seats = await examSeatsService.deleteAllSeats(tx, ctx, examId);

      const exam = await tx.exam.delete({
        where: { id: examId, tenantId: ctx.user.tenantId },
      });

      return { ...exam, seats };
    });
  }

  async startExam(ctx: AuthRequestContext, examId: string) {
    return db.$transaction(async (tx) => {
      await this.getExamById(tx, ctx, examId);

      const exam = await tx.exam.update({
        where: { id: examId, tenantId: ctx.user.tenantId },
        data: { status: ExamStatus.OPEN },
        include: {
          seats: true,
          test: {
            include: {
              sections: true,
            },
          },
        },
      });

      return exam;
    });
  }
}

const examService = new ExamService();

export default examService;
