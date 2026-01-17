import { AuthRequestContext } from '@/lib/auth/types'
import { CreateExamSeatSchema } from '@/validators/exam-seat.schema'
import db from '@/lib/db'

class ExamSeatsService {
  constructor() {}

  private generateAccessCode() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const chunks = []

    for (let i = 0; i < 3; i++) {
      let chunk = ''
      for (let j = 0; j < 4; j++) {
        chunk += chars[Math.floor(Math.random() * chars.length)]
      }
      chunks.push(chunk)
    }

    return chunks.join('-')
  }

  async createSeat(
    ctx: AuthRequestContext,
    examSessionId: string,
    data: CreateExamSeatSchema,
  ) {
    const accessCode = this.generateAccessCode()
    const candidateId = Math.random().toString(36).substring(2, 8)
    const seat = await db.examSeat.create({
      data: {
        ...data,
        accessCode,
        candidateId,
        sessionId: examSessionId,
        tenantId: ctx.user.tenantId,
      },
    })
    return seat
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
        orderBy: { createdAt: 'desc' },
      }),
      db.examSeat.count({
        where: { tenantId: ctx.user.tenantId, sessionId: examSessionId },
      }),
    ])
    return { items, totalItems }
  }
}

const examSeatsService = new ExamSeatsService()

export default examSeatsService
