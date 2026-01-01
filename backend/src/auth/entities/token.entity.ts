import { UserRole } from 'prisma/generated/enums';

export type TokenInfo = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  id: string;
  tenantId: string | null;
  roles: UserRole[];
};
