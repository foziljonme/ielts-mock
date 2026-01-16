// src/lib/errors/withErrorHandling.ts
import { AppError } from './AppError'
import { NextApiHandler } from 'next'

export const withErrorHandling =
  (handler: NextApiHandler): NextApiHandler =>
  async (req, res) => {
    try {
      await handler(req, res)
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          error: {
            message: err.message,
            // code: err.code,
            details: err.details ?? null,
          },
        })
      }

      console.error(err)

      return res.status(500).json({
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      })
    }
  }
