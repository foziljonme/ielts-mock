import { validate } from '@/lib/api/validate'
import { withAuth } from '@/lib/auth/withAuth'
import userService from '@/services/user.service'
import { PaginatedResponse } from '@/types/pagination'
import { paginationSchema } from '@/validators/pagination.schema'
import { NextApiRequest, NextApiResponse } from 'next'

export default withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { page, pageSize } = validate(paginationSchema, req.query)
    const { items, totalItems } = await userService.getUsers(page, pageSize)

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
})
