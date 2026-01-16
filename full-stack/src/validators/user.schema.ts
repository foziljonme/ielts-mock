import { z } from 'zod'

export const createUserSchema = z.object({
  tenantId: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  tenantId: z.string().optional(),
  email: z.string().email(),
  name: z.string().min(1),
})

export type UpdateUserSchema = z.infer<typeof updateUserSchema>
