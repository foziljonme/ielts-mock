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
      const user = await authService.getMe(ctx)
      res.status(200).json(user)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
