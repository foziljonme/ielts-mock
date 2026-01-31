import { validate } from "@/lib/api/validate";
import { asyncHandler } from "@/lib/utils/asyncHandler";
import { AuthRequest } from "@/middlewares/auth";
import userService from "@/services/user.service";
import { PaginatedResponse } from "@/types/pagination";
import { paginationSchema } from "@/validators/pagination.schema";
import { updateUserSchema } from "@/validators/user.schema";

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
