export enum ExamSessionStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
export interface IExamSession {
  id: string;
  tenantId: string;
  testId: string;
  name: string;
  examDate: string;
  startTime: string;
  endTime: string | null;
  status: ExamSessionStatus;
  createdAt: string;
  seats: IExamSeat[];
}

export enum ExamSeatStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  EXPIRED = "EXPIRED",
}
export interface IExamSeat {
  id: string;
  sessionId: string;
  seatNumber: number;
  label: string;
  accessCode: string;
  candidateName: string;
  candidateId: string;
  candidateContact: string;
  status: ExamSeatStatus;
  startedAt: string | null;
  submittedAt: string | null;
}

export interface ITenant {
  id: string;
  name: string;
  subdomain: string;
  isActive: boolean;
  createdAt: string;
}

export interface ITenantStats {
  sessions: {
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
  };
  seats: {
    total: number;
    used: number;
    available: number;
  };
}

export interface ICreateExamSeatPayload {
  sessionId?: string;
  seatNumber?: number;
  label?: string;
  accessCode?: string;
  candidateName?: string;
  candidateId?: string;
  candidateContact?: string;
}

export interface ICreateExamSessionPayload {
  name: string;
  examDate: string;
  startTime: string;
  endTime: string | null;
  status: ExamSessionStatus;
  seats: ICreateExamSeatPayload[];
}
