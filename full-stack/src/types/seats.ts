import { Prisma } from '../../prisma/generated/client'
import { ExamSeatStatus } from '../../prisma/generated/enums'
import { IExam } from './exams'

export type ISeat = Prisma.ExamSeatGetPayload<{}>

export type ISeatWithExam = Prisma.ExamSeatGetPayload<{
  include: {
    exam: true
  }
}>

export interface ISeatInput {
  label?: string
  candidateName: string
  candidateContact: string
}

export interface IAvailableTest {
  id: string
  title: string
  status: string
  updatedAt: string
  sectionsPresent: string[]
  totalQuestions: number
}
