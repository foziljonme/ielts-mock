// import { Pool } from "pg"; // Add this import
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../../prisma/generated/client";

// const globalForDb = global as unknown as {
//   db: PrismaClient;
// };

// const pool = new Pool({
//   // Create a Pool instance first
//   connectionString: process.env.DATABASE_URL,
//   // Optional: Add other pg.Pool options if needed, e.g., max: 20, idleTimeoutMillis: 30000
// });

// const adapter = new PrismaPg(pool); // Pass the pool to PrismaPg

// const db =
//   globalForDb.db ||
//   new PrismaClient({
//     adapter,
//   });

// if (process.env.NODE_ENV !== "production") globalForDb.db = db;

// export default db;
import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/generated/client";

console.log(process.env.DATABASE_URL);
const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

export default prisma;
