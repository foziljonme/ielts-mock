import db from '@/lib/db'
import { AppError } from '@/lib/errors'

class UserService {
  constructor() {}

  async getUsers(page: number, pageSize: number) {
    const [itemsWithPassword, totalItems] = await db.$transaction([
      db.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      db.user.count(),
    ])
    const items = itemsWithPassword.map(item => {
      const { password, ...rest } = item

      return rest
    })
    return { items, totalItems }
  }

  async getUserById(id: string) {
    const user = await db.user.findUnique({ where: { id } })
    if (!user) {
      throw new AppError('User not found', 404)
    }
    return user
  }
}

const userService = new UserService()

export default userService
