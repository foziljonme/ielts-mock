import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
})

export const loginCandidateSchema = z.object({
  accessCode: z.string(),
  candidateId: z.string(),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
export type LoginCandidateSchema = z.infer<typeof loginCandidateSchema>
