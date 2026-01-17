import { validate } from '@/lib/api/validate'
import { authUser } from '@/lib/auth'
import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import { loginSchema } from '@/validators/auth.schema'
import { NextApiRequest, NextApiResponse } from 'next'

export default withErrorHandling(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const loginData = validate(loginSchema, req.body)
      const user = await authUser(loginData)
      res.status(200).json(user)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
