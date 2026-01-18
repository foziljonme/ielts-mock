import { validate } from '@/lib/api/validate'
import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import { loginSchema } from '@/validators/auth.schema'
import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import authService from '@/services/auth.service'
import { TOKEN_EXPIRES_IN } from '@/lib/constants'

export default withErrorHandling(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const loginData = validate(loginSchema, req.body)
      const { user, accessToken } = await authService.login(loginData)

      res.setHeader(
        'Set-Cookie',
        serialize('auth_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: TOKEN_EXPIRES_IN,
          // maxAge: 60 * 15, // 15 min
        }),
      )
      const { tenant, ...restUser } = user

      res.status(200).json({ user: restUser, tenant })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
