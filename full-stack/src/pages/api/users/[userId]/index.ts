import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import userService from '@/services/user.service'
import { NextApiRequest, NextApiResponse } from 'next'

export default withErrorHandling(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      const { userId } = req.query
      const user = await userService.getUserById(userId as string)
      res.status(200).json(user)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
