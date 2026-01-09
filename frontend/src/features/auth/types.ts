export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  exp: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
  tenantName?: string;
  avatar?: string;
}

export type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

export type Permission = {
  id: string;
  name: string;
};

// export type UserRole = "teacher" | "student" | "admin" | "OWNER";

export enum UserRole {
  OWNER = "OWNER", // Platform admin
  TENANT = "TENANT", // Center admin
  STAFF = "STAFF", // Proctors / staff
  STUDENT = "STUDENT", // Student / session user
}

export type UserRoleTypeForAuthLayout = {
  label: string;
  value: UserRole;
  icon: any;
};

export interface ISeat {
  id: string;
  sessionId: string;
  seatNumber: number;
  label: string;
  accessCode: string;
  assignedStudentName: string;
  assignedStudentId: string;
}

export interface ISchedule {
  id: string;
  testId: string;
  tenantId: string;
  startTime: string;
  endTime: string | null;
}

export type AttemptStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface IAttempt {
  id: string;
  seatId: string;
  sessionId: string;
  status: AttemptStatus;
  startedAt: string | null;
  submittedAt: string | null;
}

export interface ISessionResponse {
  subjectId: string;
  examId?: string;
  type: UserRole[];
  authenticated: boolean;
}

export interface IExamSeatSession {
  seat: ISeat;
  schedule: ISchedule;
  attempt: IAttempt;
}

export interface ILoginResponse {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
}

export enum AuthType {
  ADMIN = "admin",
  EXAM = "exam",
}
