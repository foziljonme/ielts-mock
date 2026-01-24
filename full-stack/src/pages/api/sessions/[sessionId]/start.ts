import { AuthRequestContext } from '@/lib/auth/types'
import { withAuth } from '@/lib/auth/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import examSessionService from '@/services/examSession.service'

export default withAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthRequestContext,
  ) => {
    if (req.method === 'POST') {
      const { sessionId } = req.query
      const session = await examSessionService.startSession(
        ctx,
        sessionId as string,
      )
      res.status(201).json(session)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
