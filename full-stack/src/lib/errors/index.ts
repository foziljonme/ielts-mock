import { AppError } from './AppError'

export class ValidationError extends AppError {
  constructor(details?: unknown) {
    // super('Validation failed', 400, 'VALIDATION_ERROR', details)
    super('Validation failed', 400, details)
  }
}

export * from './AppError'
