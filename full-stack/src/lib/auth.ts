import { LoginSchema } from '@/validators/auth.schema'
import db from './db'
import { AppError } from './errors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const authUser = async (credentials: LoginSchema) => {
  const { email, password } = credentials

  const user = await db.user.findUnique({ where: { email } })

  if (!user) {
    throw new AppError('User not found', 404)
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new AppError('Unauthorized', 401)
  }

  const accessToken = jwt.sign(
    { sub: user.id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  )

  const refreshToken = jwt.sign(
    { sub: user.id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )

  return {
    accessToken,
    refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
}
