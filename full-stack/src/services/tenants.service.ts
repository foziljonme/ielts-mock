import { CreateTenantSchema } from '@/validators/tenant.schema'
import db from '../lib/db'
import { AppError } from '@/lib/errors'
import { ErrorCodes } from '@/lib/errors/codes'
import { TransactionClient } from '../../prisma/generated/internal/prismaNamespace'

class TenantsService {
  constructor() {}

  async createTenant(tenantData: CreateTenantSchema) {
    return db.$transaction(async tx => {
      const existingTenant = await tx.tenant.findUnique({
        where: { subdomain: tenantData.subdomain },
        include: { tenantSeatUsage: true },
      })

      if (existingTenant) {
        throw new Error('Tenant already exists')
      }

      const tenant = await tx.tenant.create({ data: tenantData })

      await tx.tenantSeatUsage.create({
        data: {
          tenantId: tenant.id,
          usedSeats: 0,
        },
      })

      return tenant
    })
  }

  async getTenants(page: number, pageSize: number) {
    const [tenants, totalTenants] = await db.$transaction([
      db.tenant.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { tenantSeatUsage: true },
      }),
      db.tenant.count(),
    ])

    const results = tenants.map(tenant => {
      const { tenantSeatUsage, ...rest } = tenant
      return {
        ...rest,
        seatUsage: tenantSeatUsage?.usedSeats,
      }
    })

    return { items: results, totalItems: totalTenants }
  }

  async getTenant(tx: TransactionClient, id: string) {
    const tenant = await tx.tenant.findUnique({
      where: { id },
      include: { tenantSeatUsage: true },
    })

    if (!tenant) {
      throw new AppError('Tenant not found', 404, ErrorCodes.TENANT_NOT_FOUND)
    }

    const { tenantSeatUsage, ...rest } = tenant
    return {
      ...rest,
      seatUsage: tenantSeatUsage?.usedSeats,
    }
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
