import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { AuthRequestContext, JwtBasePayload } from './types'
import { AppError } from '../errors'
import { withErrorHandling } from '../errors/withErrorHandling'
import { UserRole } from '../../../prisma/generated/enums'
import { ErrorCodes } from '../errors/codes'

export function withAuth(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthRequestContext,
  ) => any,
  options?: { roles?: string[]; candidateCanAccess?: boolean },
): NextApiHandler {
  return withErrorHandling(async (req, res) => {
    const token = req.cookies['auth_token']

    if (!token) {
      throw new AppError('Unauthorized', 401, 'No token provided')
    }

    let payload: JwtBasePayload | null = null
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET, {}) as JwtBasePayload
    } catch {
      throw new AppError(
        'Unauthorized',
        401,
        'Invalid token. Please login again.',
      )
    }
    const { roles, candidateCanAccess = false } = options ?? {}

    if (!candidateCanAccess && payload.roles.includes(UserRole.CANDIDATE)) {
      throw new AppError(
        'Forbidden',
        403,
        ErrorCodes.FORBIDDEN,
        'You are not authorized to access this resource',
      )
    }

    if (roles && !roles.some(role => payload.roles.includes(role))) {
      throw new AppError(
        'Forbidden',
        403,
        ErrorCodes.FORBIDDEN,
        'You are not authorized to access this resource',
      )
    }
    const ctx = { user: payload }

    return handler(req, res, ctx)
  })
}
