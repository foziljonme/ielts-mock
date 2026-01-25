import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

export default withErrorHandling(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      res.setHeader(
        'Set-Cookie',
        serialize('auth_token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 0,
        }),
      )
      res.status(200).json({ message: 'Logout successful' })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
