import { validate } from '@/lib/api/validate'
import { withAuth } from '@/lib/auth/withAuth'
import { PaginatedResponse } from '@/types/pagination'
import { paginationSchema } from '@/validators/pagination.schema'
import { NextApiRequest, NextApiResponse } from 'next'
import examSessionService from '@/services/examSession.service'
import { createExamSessionSchema } from '@/validators/exam-session.schema'
import { AuthRequestContext } from '@/lib/auth/types'

export default withAuth(
  async (
    req: NextApiRequest,
    res: NextApiResponse,
    ctx: AuthRequestContext,
  ) => {
    if (req.method === 'POST') {
      const data = validate(createExamSessionSchema, req.body)
      const session = await examSessionService.createSession(ctx, data)
      res.status(201).json(session)
    } else if (req.method === 'GET') {
      const { page, pageSize } = validate(paginationSchema, req.query)
      const { items, totalItems } = await examSessionService.getSessions(
        ctx,
        page,
        pageSize,
      )

      const totalPages = Math.ceil(totalItems / pageSize)

      const response: PaginatedResponse<(typeof items)[number]> = {
        results: items,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
        },
      }

      res.status(200).json(response)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
