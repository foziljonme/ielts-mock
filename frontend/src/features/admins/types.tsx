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
