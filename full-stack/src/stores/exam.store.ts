import { ISeat } from '@/types/seats'
import { create } from 'zustand'
import { IExam, ISectionWithQuestions } from '@/types/exams'
import { toastError } from '@/lib/notifications/toastError'
import httpClient from '@/lib/httpClient'
import { useScheduleTestStore } from './scheduleTest.store'
import { TestSkill } from '../../prisma/generated/enums'
import { GetCurrentSectionReturn } from '@/types'

interface IExamStore {
  isLoading: boolean
  examSeatInfo: ISeat | null
  activeSection: ISectionWithQuestions | null
  completedSections: Set<TestSkill>
  currentExam: IExam | null

  setCurrentExam: (exam: IExam) => void
  fetchCurrentExam: (examId: string) => Promise<void>
  setExamSeatInfo: (seat: ISeat) => void
  startExam: (examId: string) => Promise<void>
  startSection: (examId: string, sectionId: string) => Promise<void>
  completeSection: (section: TestSkill) => void
  fetchCurrentSection: () => Promise<void>
  submitSection: (answers: Record<string, string>) => Promise<void>
  autoSave: (questionId: string, answer: string) => Promise<void>
  // onSectionStarted: (info: any) => void
}

const useExamStore = create<IExamStore>((set, get) => ({
  isLoading: false,
  examSeatInfo: null,
  activeSection: null,
  completedSections: new Set<TestSkill>(),
  currentExam: null,

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
  startExam: async (examId: string) => {
    set({ isLoading: true })
    try {
      const examUpdated: any = await httpClient.post(
        `/exams/${examId}/start`,
        {},
      )

      set({ currentExam: examUpdated })

      useScheduleTestStore.getState().updateLocalSession(examId, examUpdated)
    } catch (error) {
      toastError({ title: 'Failed to start exam exam', error })
    } finally {
      set({ isLoading: false })
    }
  },
  startSection: async (examId: string, sectionId: string) => {
    try {
      set({ isLoading: true })
      const sectionStarted = await httpClient.post(
        `exams/${examId}/sections/${sectionId}/start`,
        {},
      )
      console.log('Exam started response', sectionStarted)
    } catch (error) {
      toastError({ title: 'Failed to start section', error })
    } finally {
      set({ isLoading: false })
    }
  },
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
  // onSectionStarted: async info => {
  //   console.log('Section started', info)
  //   const currentSection = await httpClient.get('/candidate/current-section')
  //   // setCurrentExam(get().currentExam)
  // },
  completeSection: (section: TestSkill) =>
    set(state => ({
      completedSections: new Set([...state.completedSections, section]),
    })),
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

export default useExamStore
