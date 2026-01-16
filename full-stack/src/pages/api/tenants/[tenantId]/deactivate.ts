import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import tenantsService from '@/services/tenants.service'
import { NextApiRequest, NextApiResponse } from 'next'

export default withErrorHandling(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const { tenantId } = req.query
      const tenant = await tenantsService.deactivateTenant(tenantId as string)
      res.status(200).json(tenant)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
