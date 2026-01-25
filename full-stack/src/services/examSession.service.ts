import { AuthRequestContext } from '@/lib/auth/types'
import db from '@/lib/db'
import { AppError } from '@/lib/errors'
import {
  CreateExamSessionSchema,
  UpdateExamSessionSchema,
} from '@/validators/exam-session.schema'
import examSeatsService from './examSeat.service'
import { ErrorCodes } from '@/lib/errors/codes'
import { ExamSessionStatus, Prisma } from '../../prisma/generated/client'

class ExamSessionService {
  constructor() {}

  async createSession(ctx: AuthRequestContext, data: CreateExamSessionSchema) {
    return db.$transaction(async tx => {
      const { seats: seatsData, ...sessionData } = data
      const session = await tx.examSession.create({
        data: { ...sessionData, tenantId: ctx.user.tenantId },
      })

      const seats = await examSeatsService.createSeats(
        ctx,
        tx,
        session.id,
        seatsData,
      )

      return { ...session, seats }
    })
  }

  async getSessions(ctx: AuthRequestContext, page: number, pageSize: number) {
    const [items, totalItems] = await db.$transaction([
      db.examSession.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: { tenantId: ctx.user.tenantId },
        orderBy: { createdAt: 'desc' },
        include: {
          seats: {
            include: {
              sections: true,
            },
          },
        },
      }),
      db.examSession.count({ where: { tenantId: ctx.user.tenantId } }),
    ])

    return { items, totalItems }
  }

  async getSessionById(
    tx: Prisma.TransactionClient,
    ctx: AuthRequestContext,
    sessionId: string,
  ) {
    const session = await tx.examSession.findUnique({
      where: { id: sessionId, tenantId: ctx.user.tenantId },
      include: {
        seats: true,
      },
    })

    if (!session) {
      throw new AppError(
        'Session not found',
        404,
        ErrorCodes.NOT_FOUND,
        'Session not found, please check the session id',
      )
    }

    return session
  }

  async getSessionByIdWithTx(ctx: AuthRequestContext, sessionId: string) {
    return db.$transaction(async tx => {
      return this.getSessionById(tx, ctx, sessionId)
    })
  }

  async updateSession(
    ctx: AuthRequestContext,
    sessionId: string,
    data: UpdateExamSessionSchema,
  ) {
    return db.$transaction(async tx => {
      await this.getSessionById(tx, ctx, sessionId)

      const session = await tx.examSession.update({
        where: { id: sessionId, tenantId: ctx.user.tenantId },
        data,
      })
      return session
    })
  }

  async archiveSession(ctx: AuthRequestContext, sessionId: string) {
    return db.$transaction(async tx => {
      await this.getSessionById(tx, ctx, sessionId)

      const session = await tx.examSession.update({
        where: { id: sessionId, tenantId: ctx.user.tenantId },
        data: { isArchived: true },
      })
      return session
    })
  }

  async deleteSession(ctx: AuthRequestContext, sessionId: string) {
    return db.$transaction(async tx => {
      await this.getSessionById(tx, ctx, sessionId)

      const seats = await examSeatsService.deleteAllSeats(tx, ctx, sessionId)

      const session = await tx.examSession.delete({
        where: { id: sessionId, tenantId: ctx.user.tenantId },
      })

      return { ...session, seats }
    })
  }

  async startSession(ctx: AuthRequestContext, sessionId: string) {
    return db.$transaction(async tx => {
      await this.getSessionById(tx, ctx, sessionId)

      const session = await tx.examSession.update({
        where: { id: sessionId, tenantId: ctx.user.tenantId },
        data: { status: ExamSessionStatus.OPEN },
      })

      return session
    })
  }
}

const examSessionService = new ExamSessionService()

export default examSessionService
