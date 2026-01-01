import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'prisma/generated/enums';

export const ACCESS_ROLES_KEY = 'access_roles';
export type RequiredRoles = UserRole[];

export const AccessRoles = (...roles: RequiredRoles) =>
  SetMetadata(ACCESS_ROLES_KEY, roles);
