import { CreateUserSchema } from '@/validators/user.schema'
import prisma from '../lib/db'
import bcrypt from 'bcrypt'
import { UserRole } from '../../prisma/generated/enums'
import { AppError } from '@/lib/errors'

class AuthService {
  constructor() {}

  async register(user: CreateUserSchema) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    })
    if (existingUser) {
      throw new AppError('User already exists', 400)
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)

    return await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        roles: user.roles || [UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    })
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    return user
  }

  async adminLogin(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    return user
  }

  async candidateLogin(candidateId: string, accessCode: string) {
    const seat = await prisma.examSeat.findUnique({
      where: { accessCode, candidateId },
    })

    if (!seat) {
      throw new Error('Seat not found')
    }

    return seat
  }

  async adminMe() {}

  async candidateMe() {}

  async logout() {}
}

const authService = new AuthService()

export default authService
