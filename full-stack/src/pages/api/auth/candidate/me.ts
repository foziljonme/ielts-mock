import { AuthRequestContext } from '@/lib/auth/types'
import { withAuth } from '@/lib/auth/withAuth'
import authService from '@/services/auth.service'
import { NextApiRequest, NextApiResponse } from 'next'

export default withAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthRequestContext,
  ) => {
    if (req.method === 'GET') {
      const result = await authService.getMeCandidate(ctx)
      return res.status(200).json(result)
    } else {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }
  },
  { candidateCanAccess: true },
)
