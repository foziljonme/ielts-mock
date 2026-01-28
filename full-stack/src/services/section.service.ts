import db from '@/lib/db'
import { ExamSessionStatus, TestSection } from '../../prisma/generated/enums'
import { AppError } from '@/lib/errors'
import { AuthRequestContext } from '@/lib/auth/types'
import { ErrorCodes } from '@/lib/errors/codes'

class SectionService {
  constructor() {}

  async start(
    ctx: AuthRequestContext,
    sessionId: string,
    sectionName: TestSection,
  ) {
    return await db.$transaction(async tx => {
      const session = await tx.examSession.findUnique({
        where: { id: sessionId, tenantId: ctx.user.tenantId },
      })

      if (!session) {
        throw new AppError(
          'Session not found',
          404,
          ErrorCodes.NOT_FOUND,
          'Make sure session is valid and you have access to it',
        )
      }

      if (session.status !== ExamSessionStatus.OPEN) {
        throw new AppError(
          'Session is not open',
          400,
          ErrorCodes.BAD_REQUEST,
          'Make sure that test is open to start the section',
        )
      }

      return await tx.examSession.update({
        where: { id: sessionId },
        data: { currentSection: sectionName },
      })
    })
  }
}
