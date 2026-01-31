import db from "@/config/db";
import { AppError } from "@/shared/utils/errors";
import { UpdateUserSchema, UserFilterSchema } from "@/validators/user.schema";

class UserService {
  constructor() {}

  async getUsers(page: number, pageSize: number, filter?: UserFilterSchema) {
    const [itemsWithPassword, totalItems] = await db.$transaction([
      db.user.findMany({
        where: {
          isDeleted: false,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({
        where: {
          isDeleted: false,
        },
      }),
    ]);
    const items = itemsWithPassword.map((item) => {
      const { password, ...rest } = item;

      return rest;
    });
    return { items, totalItems };
  }

  async getUserById(id: string) {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserSchema) {
    await this.getUserById(id);

    const user = await db.user.update({ where: { id }, data });
    return user;
  }

  async deleteUser(id: string) {
    await this.getUserById(id);

    await db.user.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { success: true };
  }
}

const userService = new UserService();

export default userService;
