import { ExamSessionStatus, TestSection } from '../../prisma/generated/enums'
import { ISeat, ISeatInput } from './seats'

export interface ISession {
  id: string
  tenantId: string
  testId: string
  name: string
  examDate: string
  status: ExamSessionStatus
  isArchived: boolean
  startTime: string | null
  endTime: string | null
  createdAt: string
  seats: ISeat[]
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
