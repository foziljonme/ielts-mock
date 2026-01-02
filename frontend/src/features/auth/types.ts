export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  exp: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
  tenantName?: string;
  avatar?: string;
};

export type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

export type Permission = {
  id: string;
  name: string;
};

export type UserRole = "teacher" | "student" | "admin" | "OWNER";

export type UserRoleTypeForAuthLayout = {
  label: string;
  value: UserRole;
  icon: any;
};
