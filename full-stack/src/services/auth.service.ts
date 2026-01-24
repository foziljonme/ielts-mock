import { CreateUserSchema } from '@/validators/user.schema'
import bcrypt from 'bcrypt'
import { UserRole } from '../../prisma/generated/enums'
import { AppError } from '@/lib/errors'
import { AuthRequestContext, JwtBasePayload } from '@/lib/auth/types'
import db from '../lib/db'
import { ErrorCodes } from '@/lib/errors/codes'
import { LoginSchema } from '@/validators/auth.schema'
import jwt from 'jsonwebtoken'
import tenantsService from './tenants.service'
import { REFRESH_TOKEN_EXPIRES_IN, TOKEN_EXPIRES_IN } from '@/lib/constants'

class AuthService {
  constructor() {}

  async register(user: CreateUserSchema) {
    const existingUser = await db.user.findUnique({
      where: { email: user.email },
    })

    if (existingUser) {
      throw new AppError(
        'User already exists',
        400,
        ErrorCodes.USER_ALREADY_EXISTS,
        'User with this email already exists, try to login',
      )
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)

    return await db.user.create({
      data: {
        ...user,
        password: hashedPassword,
        roles: user.roles || [UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    })
  }

  async login(loginData: LoginSchema) {
    const { email, password } = loginData
    return db.$transaction(async tx => {
      const user = await tx.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new AppError(
          'User not found',
          404,
          ErrorCodes.USER_NOT_FOUND,
          'User with this email not found',
        )
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        throw new AppError(
          'Unauthorized',
          401,
          ErrorCodes.UNAUTHORIZED,
          'Invalid password',
        )
      }
      const tokenPayload: JwtBasePayload = {
        sub: user.id,
        tenantId: user.tenantId || '',
        roles: user.roles,
      }

      const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRES_IN,
      })

      const refreshToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      })

      const { password: ps, ...rest } = user

      const tenant = await tenantsService.getTenant(tx, user.tenantId!)

      return {
        user: {
          ...rest,
          tenant,
        },
        accessToken,
        refreshToken,
        // expiresAt: new Date(Date.now() + TOKEN_EXPIRES_IN),
      }
    })
  }

  async getMe(ctx: AuthRequestContext) {
    console.log({ ctx })
    return db.$transaction(async tx => {
      const user = await tx.user.findUnique({
        where: { id: ctx.user.sub },
      })

      if (!user) {
        throw new AppError(
          'Unauthorized',
          401,
          ErrorCodes.UNAUTHORIZED,
          'User not found',
        )
      }

      const tenant = await tenantsService.getTenant(tx, user.tenantId!)

      return {
        user: user,
        tenant: tenant,
      }
    })
  }
}

const authService = new AuthService()

export default authService
