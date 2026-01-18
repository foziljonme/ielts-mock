import { withAuth } from '@/lib/auth/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import examSessionService from '@/services/examSession.service'
import { AuthRequestContext } from '@/lib/auth/types'

export default withAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthRequestContext,
  ) => {
    const { sessionId } = req.query as { sessionId: string }

    if (req.method === 'POST') {
      await examSessionService.archiveSession(ctx, sessionId)
      res.status(200).json({ message: 'Session archived successfully' })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
