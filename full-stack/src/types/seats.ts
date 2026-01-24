import { ExamSeatStatus } from '../../prisma/generated/enums'

export interface ISeat {
  id: string
  tenantId: string
  sessionId: string
  seatNumber: number
  label: string
  accessCode: string
  candidateName: string
  candidateId: string
  candidateContact: string
  status: ExamSeatStatus
  startedAt: string | null
  submittedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ISeatInput {
  label?: string
  candidateName: string
  candidateContact: string
}

export interface IAvailableTest {
  id: string
  name: string
}
