import { withAuth } from '@/lib/auth/withAuth'
import { NextApiRequest, NextApiResponse } from 'next'
import { changePasswordSchema } from '@/validators/auth.schema'
import bcrypt from 'bcrypt'
import db from '@/lib/db'
import { validate } from '@/lib/api/validate'
import authService from '@/services/auth.service'
import { AuthRequestContext } from '@/lib/auth/types'

export default withAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthRequestContext,
  ) => {
    if (req.method === 'POST') {
      const data = validate(changePasswordSchema, req.body)
      const result = await authService.changePassword(ctx, data)
      return res.status(200).json(result)
    }
  },
)
