import { Prisma } from '../../prisma/generated/client'
import { TestSkill } from '../../prisma/generated/enums'
import { ISeat, ISeatInput } from './seats'

// export interface IExam {
//   id: string
//   tenantId: string
//   testId: string
//   examDate: string
//   status: ExamStatus
//   currentSection: ISection | null
//   isArchived: boolean
//   startTime: string | null
//   endTime: string | null
//   createdAt: string
//   seats: ISeat[]
//   sections: ISection[]
// }

export type IExam = Prisma.ExamGetPayload<{
  include: {
    examSectionProgresses: true
    seats: true
    test: {
      include: {
        sections: true
      }
    }
  }
}>

export type ISection = Prisma.SectionGetPayload<{
  include: {
    audioTracks: true
    passages: true
    questionGroups: true
    // test: true
  }
}>

export type ISectionWithQuestions = Prisma.SectionGetPayload<{
  include: {
    audioTracks: true
    passages: true
    questionGroups: {
      include: {
        questions: true
      }
    }
  }
}>

export type IQuestionGroup = Prisma.QuestionGroupGetPayload<{}>
export type IQuestionGroupWithQuestions = Prisma.QuestionGroupGetPayload<{
  include: {
    questions: true
  }
}>

export type IQuestion = Prisma.QuestionGetPayload<{}>

// export interface ISection {
//   id: string
//   sessionId: string
//   section: TestSkill
//   status: ExamSectionStatus
//   startedAt: string | null
//   endTime: string | null
//   createdAt: string | null
//   duration: number
//   order: number
// }

export interface IExamInput {
  testId: string
  examDate: string
  seats: ISeatInput[]
}

export interface ISessionProgress {
  // connectedCandidates: ISeat[]
  completedCandidates: Map<TestSkill, ISeat[]>
  currentSkill: TestSkill | null
  sectionStartTime: string | null
}
