import { AuthRequestContext } from "@/modules/auth/auth.types";
import { CreateExamSeatSchema } from "./seat.schema";
import db from "@/config/db";
import { Prisma } from "../../../../prisma/generated/client";

class ExamSeatsService {
  constructor() {}

  private generateAccessCode() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const chunks = [];

    for (let i = 0; i < 3; i++) {
      let chunk = "";
      for (let j = 0; j < 4; j++) {
        chunk += chars[Math.floor(Math.random() * chars.length)];
      }
      chunks.push(chunk);
    }

    return chunks.join("-");
  }

  private generateCandidateId() {
    return Math.random().toString(36).substring(2, 8);
  }

  async createSeat(
    ctx: AuthRequestContext,
    examSessionId: string,
    data: CreateExamSeatSchema,
  ) {
    const accessCode = this.generateAccessCode();
    const candidateId = this.generateCandidateId();
    return db.$transaction(async (tx) => {
      const [seat] = await Promise.all([
        await tx.examSeat.create({
          data: {
            ...data,
            accessCode,
            candidateId,
            sessionId: examSessionId,
            tenantId: ctx.user.tenantId,
          },
        }),
        await tx.tenantSeatUsage.update({
          where: { tenantId: ctx.user.tenantId },
          data: { usedSeats: { increment: 1 } },
        }),
      ]);

      return seat;
    });
  }

  async createSeats(
    ctx: AuthRequestContext,
    tx: Prisma.TransactionClient,
    examSessionId: string,
    data: CreateExamSeatSchema[],
  ) {
    const seats = await tx.examSeat.createMany({
      data: data.map((seat) => ({
        ...seat,
        accessCode: this.generateAccessCode(),
        candidateId: this.generateCandidateId(),
        sessionId: examSessionId,
        tenantId: ctx.user.tenantId,
      })),
    });

    await tx.tenantSeatUsage.update({
      where: { tenantId: ctx.user.tenantId },
      data: { usedSeats: { increment: data.length } },
    });

    return seats;
  }

  async getSeats(
    ctx: AuthRequestContext,
    examSessionId: string,
    page: number,
    pageSize: number,
  ) {
    const [items, totalItems] = await db.$transaction([
      db.examSeat.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: { tenantId: ctx.user.tenantId, sessionId: examSessionId },
        orderBy: { createdAt: "desc" },
      }),
      db.examSeat.count({
        where: { tenantId: ctx.user.tenantId, sessionId: examSessionId },
      }),
    ]);
    return { items, totalItems };
  }

  async deleteAllSeats(
    tx: Prisma.TransactionClient,
    ctx: AuthRequestContext,
    sessionId: string,
  ) {
    const seats = await tx.examSeat.deleteMany({
      where: { tenantId: ctx.user.tenantId, sessionId },
    });

    await tx.tenantSeatUsage.update({
      where: { tenantId: ctx.user.tenantId },
      data: { usedSeats: { decrement: seats.count } },
    });

    return seats;
  }
}

const examSeatsService = new ExamSeatsService();

export default examSeatsService;
