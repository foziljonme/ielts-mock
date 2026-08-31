import { Prisma } from '../../prisma/generated/client'

export type UserRole = 'admin' | 'staff' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  tenantId: string
}

export interface Tenant {
  id: string
  name: string
  location: string
  totalSeats: number
  agreement: string
  pricePerTest: number
  testAttempts: {
    total: number
    used: number
    remaining: number
  }
}

export interface Student {
  id: string
  name: string
  email: string
  tenantId: string
  accessCode?: string
  assignedSeat?: number
  testStatus: 'pending' | 'in-progress' | 'completed'
  testDate?: string
}

export interface TestResult {
  id: string
  studentId: string
  tenantId: string
  testDate: string
  sections: {
    listening: number
    reading: number
    writing: number
    speaking: number
  }
  overallScore: number
  completionTime: number
}

export interface SeatReservation {
  id: string
  tenantId: string
  seatNumber: number
  studentId: string
  studentName: string
  accessCode: string
  date: string
  status: 'reserved' | 'active' | 'completed'
}

export interface Question {
  id: string
  type: string
  question: string
  options?: string[]
  correctAnswer: string
  // Multiple-choice with multiple answers
  correctAnswers?: string[]
  requiredAnswerCount?: number
  // Word limit hint for short-answer / form-completion
  wordLimit?: number
}

export interface TestSection {
  id: string
  name: string
  duration: number // in minutes
  questions: Question[]
  passage?: string
  audioUrl?: string
}

export interface HighlightAnnotation {
  id: string
  text: string
  color: string
  note?: string
  position: { start: number; end: number }
}

// ─── Listening question group types ──────────────────────────────────────────

export type ListeningGroupType =
  | 'multiple-choice'
  | 'multiple-choice-multi'
  | 'form-completion'
  | 'map-labelling'
  | 'matching'
  | 'short-answer'
  | 'note-completion'
  | 'table-completion'

export interface MatchingOption {
  id: string // e.g. 'A', 'B', 'C'
  label: string
}

export interface FormField {
  label: string
  questionId: string
  prefix?: string
  suffix?: string
}

export interface FormSection {
  heading?: string
  fields: FormField[]
}

export interface MapRoomConfig {
  x: number
  y: number
  w: number
  h: number
  fill: string
  stroke?: string
  questionId?: string // if this room is a question position
  qNum?: number // question number to show in the marker
  fixedLabel?: string // pre-labelled rooms
}

export interface TableCell {
  text?: string // pre-filled text
  questionId?: string
  prefix?: string
  suffix?: string
}

export interface NoteItem {
  text?: string
  questionId?: string
  prefix?: string
  suffix?: string
  isSubBullet?: boolean
}

export interface NoteBlock {
  heading?: string
  items: NoteItem[]
}

export interface ListeningQuestionGroup {
  type: ListeningGroupType
  questionIds: string[]
  questionRange: [number, number]
  instructions: string
  // Form / Note completion
  formTitle?: string
  formSections?: FormSection[]
  // Map labelling
  mapTitle?: string
  mapOptions?: MatchingOption[] // the word/letter box
  mapRooms?: MapRoomConfig[] // room geometry for SVG
  // Matching
  matchingOptions?: MatchingOption[]
  matchingPrompt?: string
  // Table completion
  tableTitle?: string
  tableHeaders?: string[]
  tableRows?: TableCell[][]
  // Note completion
  noteTitle?: string
  noteBlocks?: NoteBlock[]
}

export interface ListeningPart {
  id: string
  label: string
  description: string
  questionRange: [number, number]
  questionIds: string[]
  groups: ListeningQuestionGroup[]
}

// ─── Backend-aligned Section model ────────────────────────────────────────────

export type InlineNode =
  | { kind: 'text'; text: string }
  | { kind: 'emphasis'; text: string }
  | { kind: 'blank'; questionId: string; label?: string }

export interface DiagramHotspot {
  questionId: string
  x: number // % of image width
  y: number // % of image height
  markerLabel?: string
}

// 'rich' is a frontend extension for cells that mix static text + blank nodes
export type LayoutTableCell =
  | {
      kind: 'text'
      text: string
      header?: boolean
      colspan?: number
      rowspan?: number
    }
  | { kind: 'blank'; questionId: string; colspan?: number; rowspan?: number }
  | { kind: 'rich'; content: InlineNode[]; colspan?: number; rowspan?: number }

// export interface FlowChartNode {
//   id: string
//   nodes: InlineNode[]
// }
export interface FlowChartConnection {
  from: string
  to: string
}

export interface FlowChartBlock {
  kind: 'flow-chart'
  title?: string
  direction?: 'vertical' | 'horizontal'
  nodes: InlineNode[][]
}

export interface FlowChartNode {
  id: string
  content: InlineNode[]
  next?: string
}

export type ContentBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'subheading'; text: string }
  | { kind: 'paragraph'; label?: string; content: InlineNode[] }
  | { kind: 'instruction'; text: string }
  | { kind: 'image'; url: string; alt?: string; hotspots?: DiagramHotspot[] }
  | { kind: 'question'; questionId: string; label?: string }
  | {
      kind: 'table'
      caption?: string
      columns: string[]
      rows: LayoutTableCell[][]
    }
  | { kind: 'list'; ordered?: boolean; items: InlineNode[][] }
  | FlowChartBlock
  | { kind: 'divider' }

export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'MULTIPLE_CHOICE_MULTI_ANSWER'
  | 'TRUE_FALSE_NOT_GIVEN'
  | 'YES_NO_NOT_GIVEN'
  | 'MATCHING_HEADING'
  | 'MATCHING_INFORMATION'
  | 'MATCHING_FEATURES'
  | 'MATCHING_SENTENCE_ENDINGS'
  | 'SENTENCE_COMPLETION'
  | 'SUMMARY_COMPLETION'
  | 'NOTE_COMPLETION'
  | 'TABLE_COMPLETION'
  | 'FORM_COMPLETION'
  | 'FLOW_CHART_COMPLETION'
  | 'DIAGRAM_LABELLING'
  | 'SHORT_ANSWER'
  | 'WRITING_TASK'
  | 'SPEAKING_PROMPT'

export interface MCConfig {
  options: { label: string; text: string }
}
export interface MCMultiConfig {
  options: string[]
  requiredCount: number
  displayRange?: string
}
export interface TextInputConfig {
  wordLimit?: number
}
export interface DiagramLabellingConfig {
  options: string[]
}
export interface MatchingConfig {
  options: string[]
}
export interface WritingTaskConfig {
  minWords: number
  recommendedTime: number
  chartType?: string
}

export interface SectionQuestion {
  id: string
  questionGroupId: string
  order: number
  prompt?: string
  config?:
    | MCConfig[]
    | MCMultiConfig
    | TextInputConfig
    | DiagramLabellingConfig
    | MatchingConfig
    | WritingTaskConfig
    | Record<string, unknown>
  correctAnswer?: string | string[] | Record<string, string>
  points: number
}

// export interface SectionQuestionGroup {
//   id: string
//   sectionId: string
//   passageId?: string
//   audioTrackId?: string
//   type: QuestionType
//   order: number
//   title?: string
//   instructions: string
//   layout: ContentBlock[]
//   questions: SectionQuestion[]
// }

export type SectionQuestionGroup = Prisma.QuestionGroupGetPayload<{
  include: {
    questions: true
  }
}>

export interface AudioTrack {
  id: string
  sectionId: string
  order: number
  title?: string
  audioUrl: string
}

export type TestSkill = 'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING'

// export interface Section {
//   id: string
//   testId: string
//   skill: TestSkill
//   order: number
//   durationSec: number
//   instructions?: string
//   audioTracks?: AudioTrack[]
//   questionGroups: SectionQuestionGroup[]
// }
export type SectionType = Prisma.SectionGetPayload<{
  include: {
    audioTracks: true
    questionGroups: {
      include: {
        questions: true
      }
    }
  }
}>

// ─── Scheduled tests & submissions ────────────────────────────────────────────

export interface ScheduledTest {
  id: string
  tenantId: string
  testDate: string
  students: {
    id: string
    name: string
    email: string
    accessCode: string
    assignedSeat?: number
  }[]
  attemptsAllocated: number
  status: 'scheduled' | 'in-progress' | 'completed'
}

export interface TestSubmission {
  id: string
  studentId: string
  studentName: string
  tenantId: string
  testDate: string
  submittedAt: string
  sections: {
    listening?: { answers: Record<string, string>; score?: number }
    reading?: { answers: Record<string, string>; score?: number }
    writing?: { answers: Record<string, string>; score?: number }
    speaking?: { answers: Record<string, string>; score?: number }
  }
  status: 'pending-review' | 'graded' | 'published'
  overallScore?: number
}

type CurrentSeatWithRelations = Prisma.ExamSeatGetPayload<{
  include: {
    exam: {
      include: {
        test: {
          include: {
            sections: {
              include: {
                audioTracks: true
                passages: true
                questionGroups: {
                  include: {
                    questions: true
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}>

export type GetCurrentSectionReturn = Omit<CurrentSeatWithRelations, 'exam'> & {
  currentSection:
    | CurrentSeatWithRelations['exam']['test']['sections'][number]
    | undefined
}
