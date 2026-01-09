export type UserRole = "admin" | "staff" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  location: string;
  totalSeats: number;
  agreement: string;
  pricePerTest: number;
  testAttempts: {
    total: number;
    used: number;
    remaining: number;
  };
}

export interface Student {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  accessCode?: string;
  assignedSeat?: number;
  testStatus: "pending" | "in-progress" | "completed";
  testDate?: string;
}

export interface TestResult {
  id: string;
  studentId: string;
  tenantId: string;
  testDate: string;
  sections: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  overallScore: number;
  completionTime: number;
}

export interface SeatReservation {
  id: string;
  tenantId: string;
  seatNumber: number;
  studentId: string;
  studentName: string;
  accessCode: string;
  date: string;
  status: "reserved" | "active" | "completed";
}

export interface Question {
  id: string;
  type:
    | "multiple-choice"
    | "text"
    | "true-false-not-given"
    | "matching"
    | "fill-blank";
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface TestSection {
  id: string;
  name: string;
  duration: number; // in minutes
  questions: Question[];
  passage?: string;
  audioUrl?: string;
}

export interface HighlightAnnotation {
  id: string;
  text: string;
  color: string;
  note?: string;
  position: { start: number; end: number };
}

export interface ScheduledTest {
  id: string;
  tenantId: string;
  testDate: string;
  students: {
    id: string;
    name: string;
    email: string;
    accessCode: string;
    assignedSeat?: number;
  }[];
  attemptsAllocated: number;
  status: "scheduled" | "in-progress" | "completed";
}

export interface TestSubmission {
  id: string;
  studentId: string;
  studentName: string;
  tenantId: string;
  testDate: string;
  submittedAt: string;
  sections: {
    listening?: {
      answers: Record<string, string>;
      score?: number;
    };
    reading?: {
      answers: Record<string, string>;
      score?: number;
    };
    writing?: {
      answers: Record<string, string>;
      score?: number;
    };
    speaking?: {
      answers: Record<string, string>;
      score?: number;
    };
  };
  status: "pending-review" | "graded" | "published";
  overallScore?: number;
}
