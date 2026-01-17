import { validate } from '@/lib/api/validate'
import { AuthRequestContext } from '@/lib/auth/types'
import { withAuth } from '@/lib/auth/withAuth'
import examSeatsService from '@/services/examSeat.service'
import { PaginatedResponse } from '@/types/pagination'
import { createExamSeatSchema } from '@/validators/exam-seat.schema'
import { paginationSchema } from '@/validators/pagination.schema'
import { NextApiRequest, NextApiResponse } from 'next'

export default withAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthRequestContext,
  ) => {
    const { sessionId } = req.query as { sessionId: string }
    if (req.method === 'POST') {
      const createExamSeatData = validate(createExamSeatSchema, req.body)
      const examSeat = await examSeatsService.createSeat(
        ctx,
        sessionId,
        createExamSeatData,
      )
      res.status(201).json(examSeat)
    } else if (req.method === 'GET') {
      const { page, pageSize } = validate(paginationSchema, req.query)

      const { items, totalItems } = await examSeatsService.getSeats(
        ctx,
        sessionId,
        page,
        pageSize,
      )

      const response: PaginatedResponse<(typeof items)[number]> = {
        results: items,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        },
      }

      res.status(200).json(response)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
