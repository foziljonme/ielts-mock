import { validate } from '@/lib/api/validate'
import { withAuth } from '@/lib/auth/withAuth'
import { AppError, ValidationError } from '@/lib/errors'
import tenantsService from '@/services/tenants.service'
import { PaginatedResponse } from '@/types/pagination'
import { paginationSchema } from '@/validators/pagination.schema'
import { createTenantSchema } from '@/validators/tenant.schema'
import { NextApiRequest, NextApiResponse } from 'next'
import { ZodError, treeifyError } from 'zod'
import { UserRole } from '../../../../prisma/generated/enums'

export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const tenantPayload = createTenantSchema.parse(req.body)
        const tenant = await tenantsService.createTenant(tenantPayload)
        res.status(200).json(tenant)
      } catch (error: any) {
        if (error instanceof ZodError) {
          throw new ValidationError(treeifyError(error))
        }
      }
    } else if (req.method === 'GET') {
      try {
        const { page, pageSize } = validate(paginationSchema, req.query)
        const { items, totalItems } = await tenantsService.getTenants(
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
      } catch (error: any) {
        throw new AppError(error.message, 500)
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
  { roles: [UserRole.PLATFORM_ADMIN] },
)
