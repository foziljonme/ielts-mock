import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../prisma/generated/client'

const globalForDb = global as unknown as {
  db: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const db =
  globalForDb.db ||
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') globalForDb.db = db

export default db
