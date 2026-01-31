import { AppError } from './AppError'
import { ErrorCodes } from './codes'

export class ValidationError extends AppError {
  constructor(details?: string | object) {
    // super('Validation failed', 400, 'VALIDATION_ERROR', details)
    super('Validation failed', 400, ErrorCodes.VALIDATION_ERROR, details)
  }
}

export * from './AppError'
