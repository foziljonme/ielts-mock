import { validate } from "@/shared/utils/validate";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import { AuthRequest } from "@/middlewares/auth";
import userService from "@/modules/users/user.service";
import { PaginatedResponse } from "@/shared/types/pagination";
import { paginationSchema } from "@/shared/validators/pagination.schema";
import { updateUserSchema } from ".//user.schema";

export const listUsers = asyncHandler(async (req: AuthRequest, res) => {
  const { page, pageSize } = validate(paginationSchema, req.query);
  const { items, totalItems } = await userService.getUsers(page, pageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const response: PaginatedResponse<(typeof items)[number]> = {
    results: items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };

  res.status(200).json(response);
});

export const getUserById = asyncHandler(async (req: AuthRequest, res) => {
  const { userId } = req.params as { userId: string };
  const user = await userService.getUserById(userId);
  res.status(200).json(user);
});

export const updateUser = asyncHandler(async (req: AuthRequest, res) => {
  const { userId } = req.params as { userId: string };
  const updateUserData = validate(updateUserSchema, req.body);
  const user = await userService.updateUser(userId, updateUserData);
  res.status(200).json(user);
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res) => {
  const { userId } = req.params as { userId: string };
  const user = await userService.deleteUser(userId);
  res.status(200).json(user);
});
