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

// Common types shared across question types
export type QuestionId = string;
export type QuestionNumber = number;

export interface Audio {
  url: string;
  playOnce?: boolean;
  startFromQuestion?: number; // optional, for sections that start later in audio
}

// Base for any question block that has constraints (e.g., word limits)
export interface QuestionConstraints {
  maxWords?: number;
  allowed?: "WORD" | "NUMBER" | "WORD_OR_NUMBER";
}

// ========================
// Individual Question Type Interfaces
// ========================

// 1. Note Completion / Form Completion / Summary Completion etc.
export interface NoteCompletionBlock {
  type:
    | "TITLE"
    | "ROW"
    | "QUESTION_ROW"
    | "QUESTION_BULLET"
    | "SECTION_HEADER"
    | "TEXT";

  // Shared by most
  text?: string;
  label?: string;
  value?: string; // for pre-filled like "Sadie Jones"
  template?: string; // e.g., "{{blank}} Street" or "shopping and visit to the {{blank}}"

  // Only for question rows/bullets
  questionId?: QuestionId;
  number?: QuestionNumber;
  constraints?: QuestionConstraints;
}

export interface NoteCompletionQuestionType {
  type: "NOTE_COMPLETION";
  range: string; // e.g., "1-10" or "11-15"
  instructions: string[];
  layout?: "FORM_NOTES" | "SUMMARY" | "FLOW_CHART"; // optional, for future variations
  blocks: NoteCompletionBlock[];
}

// 2. Multiple Choice - Single Answer
export interface MultipleChoiceSingleItem {
  questionId: QuestionId;
  number: QuestionNumber;
  stem: string;
  options: Array<{
    key: string; // "A", "B", "C", etc.
    text: string;
  }>;
}

export interface MultipleChoiceSingleQuestionType {
  type: "MULTIPLE_CHOICE_SINGLE";
  range: string; // e.g., "16-20"
  instructions: string[];
  items: MultipleChoiceSingleItem[];
}

// 3. Multiple Choice - Multiple Answers (e.g., choose 5 from A-H)
export interface MultipleChoiceMultipleQuestionType {
  type: "MULTIPLE_CHOICE_MULTIPLE";
  range: string;
  instructions: string[];
  selectCount: number; // how many to choose
  stem?: string; // shared question stem
  options: Array<{
    key: string;
    text: string;
  }>;
  questions: Array<{
    questionId: QuestionId;
    number: QuestionNumber;
  }>;
}

// ========================
// Union of all possible question types in one part
// ========================

export type ListeningQuestionType =
  | NoteCompletionQuestionType
  | MultipleChoiceSingleQuestionType
  | MultipleChoiceMultipleQuestionType;
// Add more later, e.g.:
// | MatchingQuestionType
// | TableCompletionQuestionType
// | SentenceCompletionQuestionType

// ========================
// Main Listening Section Interface
// ========================

export interface ListeningSection {
  module: "LISTENING";
  part: number; // 1, 2, 3, or 4
  audio?: Audio; // usually one audio per part, can override per block if needed
  questions: ListeningQuestionType[];
}

export interface ListeningTest {
  module: "LISTENING";
  parts: ListeningSection[]; // Reuse your existing ListeningSection interface
}
