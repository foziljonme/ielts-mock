import db from '@/lib/db'
import { withErrorHandling } from '@/lib/errors/withErrorHandling'
import { NextApiRequest, NextApiResponse } from 'next'
import { UserRole } from '../../../../prisma/generated/enums'
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

const candidateGenerator = (count: number) => {
  const candidates = []
  for (let i = 0; i < count; i++) {
    candidates.push({
      candidateName: faker.person.firstName() + ' ' + faker.person.lastName(),
      candidateContact: faker.phone.number(),
    })
  }
  return candidates
}

const tenants = [
  {
    subdomain: 'saas',
    name: 'SaaS',
    seatQuota: 20,
    users: [
      {
        name: 'saas@test.net',
        email: 'saas@test.net',
        password: 'demo',
        roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    ],
  },
  {
    subdomain: 'hello-academy',
    name: 'Hello Academy',
    seatQuota: 30,
    users: [
      {
        name: 'hello-academy@test.net',
        email: 'hello-academy@test.net',
        password: 'demo',
        roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    ],
    sessions: [
      {
        testId: 'cambridge-16-test-3',
        examDate: '2026-01-22T13:00',
        seats: candidateGenerator(Math.floor(Math.random() * 10)),
      },
      {
        testId: 'cambridge-16-test-4',
        examDate: '2026-01-22T13:00',
        seats: candidateGenerator(Math.floor(Math.random() * 10)),
      },
    ],
  },
]

const onboard = async () => {
  return db.$transaction(async tx => {
    const createdDataPromises = tenants.map(tenant => {
      return tx.tenant
        .upsert({
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
        .then(async result => {
          await tx.tenantSeatUsage.upsert({
            where: { tenantId: result.id },
            create: {
              tenantId: result.id,
              usedSeats: 0,
            },
            update: {},
          })
          const users = tenant.users
          const usersPromises = users.map(user => {
            const hashedPassword = bcrypt.hashSync(user.password, 10)
            return tx.user.upsert({
              where: { email: user.email },
              create: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                tenantId: result.id,
                roles: user.roles,
              },
              update: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                tenantId: result.id,
                roles: user.roles,
              },
            })
          })
          const results = await Promise.all(usersPromises)
          return { tenant: result, users: results }
        })
    })
    return Promise.all(createdDataPromises)
  })
}

export default withErrorHandling(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const result = await onboard()
      res.status(201).json(result)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  },
)
