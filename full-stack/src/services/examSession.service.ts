import { AuthRequestContext } from '@/lib/auth/types'
import db from '@/lib/db'
import { AppError } from '@/lib/errors'
import {
  CreateExamSessionSchema,
  UpdateExamSessionSchema,
} from '@/validators/exam-session.schema'

class ExamSessionService {
  constructor() {}

  async createSession(ctx: AuthRequestContext, data: CreateExamSessionSchema) {
    const session = await db.examSession.create({
      data: { ...data, tenantId: ctx.user.tenantId },
    })
    return session
  }

  async getSessions(ctx: AuthRequestContext, page: number, pageSize: number) {
    const [items, totalItems] = await db.$transaction([
      db.examSession.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: { tenantId: ctx.user.tenantId },
        orderBy: { createdAt: 'desc' },
        include: {
          seats: true,
        },
      }),
      db.examSession.count({ where: { tenantId: ctx.user.tenantId } }),
    ])

    return { items, totalItems }
  }

  async getSessionById(ctx: AuthRequestContext, sessionId: string) {
    const session = await db.examSession.findUnique({
      where: { id: sessionId, tenantId: ctx.user.tenantId },
      include: {
        seats: true,
      },
    })

    if (!session) {
      throw new AppError('Session not found', 404)
    }

    return session
  }

  async updateSession(
    ctx: AuthRequestContext,
    sessionId: string,
    data: UpdateExamSessionSchema,
  ) {
    await this.getSessionById(ctx, sessionId)

    const session = await db.examSession.update({
      where: { id: sessionId, tenantId: ctx.user.tenantId },
      data,
    })
    return session
  }

  async archiveSession(ctx: AuthRequestContext, sessionId: string) {
    await this.getSessionById(ctx, sessionId)

    const session = await db.examSession.update({
      where: { id: sessionId, tenantId: ctx.user.tenantId },
      data: { isArchived: true },
    })
    return session
  }
}

const examSessionService = new ExamSessionService()

export default examSessionService
