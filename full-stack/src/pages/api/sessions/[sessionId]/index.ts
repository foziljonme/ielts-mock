import { withAuth } from '@/lib/auth/withAuth'
import examSessionService from '@/services/examSession.service'
import { NextApiRequest, NextApiResponse } from 'next'
import { validate } from '@/lib/api/validate'
import { updateExamSessionSchema } from '@/validators/exam-session.schema'
import { AuthRequestContext } from '@/lib/auth/types'
// import { updateExamSessionSchema } from '@/validators/exam-session.schema'

export default withAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthRequestContext,
  ) => {
    const { sessionId } = req.query as { sessionId: string }

    if (req.method === 'GET') {
      const session = await examSessionService.getSessionById(ctx, sessionId)
      res.status(200).json(session)
    } else if (req.method === 'PATCH') {
      const data = validate(updateExamSessionSchema, req.body)
      const session = await examSessionService.updateSession(
        ctx,
        sessionId,
        data,
      )
      res.status(200).json(session)
    } else if (req.method === 'DELETE') {
      // const session = await examSessionService.deleteSession(req.query.sessionId)
      // res.status(200).json(session)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
