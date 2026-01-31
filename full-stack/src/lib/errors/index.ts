import { ZodError } from 'zod'
import { AppError } from './AppError'
import { ErrorCodes } from './codes'

export class ValidationError extends AppError {
  constructor(details?: string | { errors: string[] }) {
    // super('Validation failed', 400, 'VALIDATION_ERROR', details)
    super('Validation failed', 400, ErrorCodes.VALIDATION_ERROR, details)
  }
}

export * from './AppError'
export * from './FrontError'
