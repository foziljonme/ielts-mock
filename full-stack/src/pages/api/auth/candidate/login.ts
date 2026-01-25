import { validate } from '@/lib/api/validate'
import { CANDIDATE_TOKEN_EXPIRES_IN } from '@/lib/constants'
import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import authService from '@/services/auth.service'
import { loginCandidateSchema } from '@/validators/auth.schema'
import { serialize } from 'cookie'

export default withErrorHandling(async (req, res) => {
  if (req.method === 'POST') {
    const loginData = validate(loginCandidateSchema, req.body)
    const result = await authService.loginCandidate(loginData)
    const { accessToken, ...rest } = result

    res.setHeader(
      'Set-Cookie',
      serialize('auth_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: CANDIDATE_TOKEN_EXPIRES_IN,
      }),
    )

    res.status(200).json(rest)
  }
})
