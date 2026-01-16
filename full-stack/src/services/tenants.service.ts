import { CreateTenantSchema } from '@/validators/tenant.schema'
import db from '../lib/db'

class TenantsService {
  constructor() {}

  async createTenant(tenant: CreateTenantSchema) {
    const existingTenant = await db.tenant.findUnique({
      where: { subdomain: tenant.subdomain },
    })

    if (existingTenant) {
      throw new Error('Tenant already exists')
    }

    return await db.tenant.create({ data: tenant })
  }

  async getTenants(page: number, pageSize: number) {
    const [tenants, totalTenants] = await db.$transaction([
      db.tenant.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      db.tenant.count(),
    ])

    return { items: tenants, totalItems: totalTenants }
  }

  async activateTenant(id: string) {
    return await db.tenant.update({
      where: { id },
      data: { isActive: true },
    })
  }

  async deactivateTenant(id: string) {
    return await db.tenant.update({
      where: { id },
      data: { isActive: false },
    })
  }
}

const tenantsService = new TenantsService()

export default tenantsService
