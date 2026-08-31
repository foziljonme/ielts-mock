import { ISeat } from '@/types/seats'
import { create } from 'zustand'
import { IExam, ISectionWithQuestions } from '@/types/exams'
import { toastError } from '@/lib/notifications/toastError'
import httpClient from '@/lib/httpClient'
import { useScheduleTestStore } from './scheduleTest.store'
import { TestSkill } from '../../prisma/generated/enums'
import { GetCurrentSectionReturn } from '@/types'

interface ICandidateStore {
  isLoading: boolean
  examSeatInfo: ISeat | null
  activeSection: ISectionWithQuestions | null
  completedSections: Set<TestSkill>
  currentExam: IExam | null
  responses: Record<string, string>

  setResponse: (qid: string, answer: string) => void
  setCurrentExam: (exam: IExam) => void
  fetchCurrentExam: (examId: string) => Promise<void>
  setExamSeatInfo: (seat: ISeat) => void
  fetchCurrentSection: () => Promise<void>
  submitSection: (answers: Record<string, string>) => Promise<void>
  autoSave: (questionId: string, answer: string) => Promise<void>
}

const useCandidateStore = create<ICandidateStore>((set, get) => ({
  isLoading: false,
  examSeatInfo: null,
  activeSection: null,
  completedSections: new Set<TestSkill>(),
  currentExam: null,
  responses: {},

  setResponse: (qid: string, answer: string) => {
    const curr = { ...get().responses }
    curr[qid] = answer
    set({ responses: curr })
  },
  setCurrentExam: (exam: IExam) => set({ currentExam: exam }),
  fetchCurrentExam: async (examId: string) => {
    try {
      const response = await httpClient.get(`/exams/${examId}`)
      get().setCurrentExam(response)
    } catch (error) {
      toastError({ title: 'Failed to fetch current exam', error })
    }
  },
  setExamSeatInfo: (seat: ISeat) => set({ examSeatInfo: seat }),
  fetchCurrentSection: async () => {
    const currentSectionInfo = await httpClient.get<GetCurrentSectionReturn>(
      '/candidate/current-section',
    )
    const sectionQuestionsSorted = currentSectionInfo
    if (sectionQuestionsSorted?.currentSection) {
      for (
        let i = 0;
        i < sectionQuestionsSorted?.currentSection.questionGroups.length;
        i++
      ) {
        sectionQuestionsSorted.currentSection.questionGroups[i].questions =
          sectionQuestionsSorted?.currentSection.questionGroups[
            i
          ].questions.sort((a: any, b: any) => a.order - b.order)
      }
    }
    set({
      activeSection: currentSectionInfo.currentSection,
    })
  },
  submitSection: async answers => {
    set({ isLoading: true })
    try {
      const response = await httpClient.post(
        `/candidate/current-section/submit`,
        {
          answers,
        },
      )
    } catch (error) {
      console.log('hererere')
      toastError({ title: 'Failed to submit section', error })
    } finally {
      set({ isLoading: false })
    }
  },
  autoSave: async (questionId, answer) => {
    try {
      const submittal = await httpClient.patch(
        `/candidate/current-section/responses/${questionId}`,
        { data: { value: answer } },
      )
    } catch (error) {
      toastError({ title: 'Could not autosave the response', error })
    }
  },
}))

export default useCandidateStore
