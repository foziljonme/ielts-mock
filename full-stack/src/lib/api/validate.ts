// src/lib/api/validate.ts
import { ZodSchema, ZodError, treeifyError } from 'zod'
import { ValidationError } from '@/lib/errors'

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError(treeifyError(err))
    }
    throw err
  }
}
