import { validate } from '@/lib/api/validate'
import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import authService from '@/services/auth.service'
import { createUserSchema } from '@/validators/user.schema'
import { NextApiRequest, NextApiResponse } from 'next'

export default withErrorHandling(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const registerUserData = validate(createUserSchema, req.body)
      const user = await authService.register(registerUserData)
      res.status(200).json(user)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
