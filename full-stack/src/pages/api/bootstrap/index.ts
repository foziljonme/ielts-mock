import db from '@/lib/db'
import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserRole } from '../../../../prisma/generated/enums'
import bcrypt from 'bcrypt'

const users = [
  {
    name: 'saas@test.net',
    email: 'saas@test.net',
    password: 'demo',
  },
]

const onboard = async () => {
  return db.$transaction(async tx => {
    const tenant = await tx.tenant.upsert({
      where: { subdomain: 'saas' },
      create: {
        subdomain: 'saas',
        name: 'SaaS',
        seatQuota: 20,
      },
      update: {
        name: 'SaaS',
        subdomain: 'saas',
        seatQuota: 20,
      },
    })
    const hashedPassword = await bcrypt.hash('demo', 10)

    const user = await tx.user.upsert({
      where: { email: 'saas@test.net' },
      create: {
        name: 'SaaS Admin',
        email: 'saas@test.net',
        password: hashedPassword,
        tenantId: tenant.id,
        roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
      update: {
        name: 'SaaS Admin',
        email: 'saas@test.net',
        password: hashedPassword,
        tenantId: tenant.id,
        roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    })

    await tx.tenantSeatUsage.upsert({
      where: { tenantId: tenant.id },
      create: {
        tenantId: tenant.id,
        usedSeats: 0,
      },
      update: {},
    })

    const { password, ...restUser } = user

    return { tenant, user: restUser }
  })
}

export default withErrorHandling(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const { tenant, user } = await onboard()
      res.status(201).json({ tenant, user })
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
