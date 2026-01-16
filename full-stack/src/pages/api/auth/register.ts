import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import authService from '@/services/auth.service'
import { NextApiRequest, NextApiResponse } from 'next'

export default withErrorHandling(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const user = await authService.register(req.body)
      res.status(200).json(user)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
