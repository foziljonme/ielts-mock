import { AuthRequestContext } from '@/lib/auth/types'
import { withAuth } from '@/lib/auth/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default withAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthRequestContext,
  ) => {
    const { sessionId, sectionId } = req.query

    if (req.method === 'POST') {
    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
