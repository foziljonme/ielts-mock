import { UserRole } from 'prisma/generated/enums';

export type TokenInfo = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayloadBase = {
  sub: string;
  tenantId: string;
  roles: UserRole[];
};

export type SessionJwtPayload = JwtPayloadBase & {
  scheduleInfo: {
    scheduleId: string;
    testId: string;
    seatId: string;
    studentName: string | null;
    studentId: string | null;
  };
};

// export type UserJwtPayload = JwtPayloadBase & {
//   user: {
//     id: string;
//     email: string;
//     roles: UserRole[];
//     tenantId: string | null;
//   };
// };
