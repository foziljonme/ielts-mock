import { Prisma } from 'prisma/generated/client';

export const SELECT_BASE_USER = {
  id: true,
  tenantId: true,
  email: true,
  createdAt: true,
  roles: true,
} as const;

export type SafeUser = Prisma.UserGetPayload<{
  select: typeof SELECT_BASE_USER;
}>;
