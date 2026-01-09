import { Building2, GraduationCap, School } from "lucide-react";
import type { UserRole, UserRoleTypeForAuthLayout } from "./types";

export const TABS: UserRoleTypeForAuthLayout[] = [
  {
    label: "Student",
    value: "student" as UserRole,
    icon: GraduationCap,
  },
  {
    label: "Teacher",
    value: "teacher" as UserRole,
    icon: School,
  },
  {
    label: "Admin",
    value: "admin" as UserRole,
    icon: Building2,
  },
];

export const LOGIN_PATH = "/auth/login";
export const SIGNUP_PATH = "/auth/signup";
export const FORGOT_PASSWORD_PATH = "/auth/forgot-password";

export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";
export const EXPIRES_AT = "expires_at";
export const AUTH_TYPE = "auth_type";
