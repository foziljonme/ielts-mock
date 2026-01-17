import { withAuth } from '@/lib/auth/withAuth'
import tenantsService from '@/services/tenants.service'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserRole } from '../../../../../prisma/generated/enums'

export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const { tenantId } = req.query
      const tenant = await tenantsService.deactivateTenant(tenantId as string)
      res.status(200).json(tenant)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
  { roles: [UserRole.PLATFORM_ADMIN] },
)
