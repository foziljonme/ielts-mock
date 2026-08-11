import { ExamSessionStatus, TestSection } from '../../prisma/generated/enums'
import { ISeat, ISeatInput } from './seats'

export interface ISession {
  id: string
  tenantId: string
  testId: string
  examDate: string
  status: ExamSessionStatus
  currentSection: any
  isArchived: boolean
  startTime: string | null
  endTime: string | null
  createdAt: string
  seats: ISeat[]
  sections: ISection[]
}

export interface ISection {
  id: string
  sessionId: string
  section: TestSection
  status: ExamSessionStatus
  startedAt: string | null
  endTime: string | null
  createdAt: string | null
  duration: number
}

export interface ISessionInput {
  testId: string
  examDate: string
  seats: ISeatInput[]
}

export interface ISessionProgress {
  // connectedCandidates: ISeat[]
  completedCandidates: Map<TestSection, ISeat[]>
  currentSection: TestSection | null
  sectionStartTime: string | null
}
