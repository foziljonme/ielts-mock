import { faker } from "@faker-js/faker";
import { UserRole } from "../../../prisma/generated/enums";
import db from "@/config/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

const candidateGenerator = (count: number) => {
  const candidates = [];
  for (let i = 0; i < count; i++) {
    candidates.push({
      candidateName: faker.person.firstName() + " " + faker.person.lastName(),
      candidateContact: faker.phone.number(),
    });
  }
  return candidates;
};

const tenants = [
  {
    subdomain: "saas",
    name: "SaaS",
    seatQuota: 20,
    users: [
      {
        name: "saas@test.net",
        email: "saas@test.net",
        password: "something123",
        roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    ],
  },
  {
    subdomain: "hello-academy",
    name: "Hello Academy",
    seatQuota: 30,
    users: [
      {
        name: "admin@global-academy.com",
        email: "admin@global-academy.com",
        password: "something123",
        roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    ],
    sessions: [
      {
        testId: "cambridge-16-test-3",
        examDate: "2026-01-22T13:00",
        seats: candidateGenerator(Math.floor(Math.random() * 10)),
      },
      {
        testId: "cambridge-16-test-4",
        examDate: "2026-01-22T13:00",
        seats: candidateGenerator(Math.floor(Math.random() * 10)),
      },
    ],
  },
];

export const bootstrap = async (req: Request, res: Response) => {
  const result = await db.$transaction(async (tx) => {
    const createdDataPromises = tenants.map((tenant) => {
      return tx.tenant
        .upsert({
          where: { subdomain: tenant.subdomain },
          create: {
            subdomain: tenant.subdomain,
            name: tenant.name,
            seatQuota: tenant.seatQuota,
          },
          update: {
            name: tenant.name,
            subdomain: tenant.subdomain,
            seatQuota: tenant.seatQuota,
          },
        })
        .then(async (result) => {
          await tx.tenantSeatUsage.upsert({
            where: { tenantId: result.id },
            create: {
              tenantId: result.id,
              usedSeats: 0,
            },
            update: {},
          });
          const users = tenant.users;
          const usersPromises = users.map((user) => {
            const hashedPassword = bcrypt.hashSync(user.password, 10);
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
            });
          });
          const results = await Promise.all(usersPromises);
          return { tenant: result, users: results };
        });
    });
    return Promise.all(createdDataPromises);
  });

  return res.status(201).json({ message: "Bootstrap successful", result });
};
