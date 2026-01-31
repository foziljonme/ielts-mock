import { z } from 'zod';
import { UserRole } from '../../prisma/generated/client';

export const createUserSchema = z.object({
  tenantId: z.string().optional(),
  email: z.email(),
  password: z.string().min(1),
  name: z.string().min(1),
  roles: z
    .array(
      z.nativeEnum(UserRole)
    ).refine(roles => roles.every(role => role !== UserRole.CANDIDATE))
    .optional(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  // tenantId: z.string().optional(),
  email: z.email().optional(),
  name: z.string().min(1).optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const userFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UserFilterSchema = z.infer<typeof userFilterSchema>;
