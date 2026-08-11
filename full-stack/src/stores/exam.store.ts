import { ISeat } from '@/types/seats'
import { create } from 'zustand'
import { TestSection } from '../../prisma/generated/enums'
import { IExam } from '@/types/exams'
import { toastError } from '@/lib/notifications/toastError'
import httpClient from '@/lib/httpClient'
import { useScheduleTestStore } from './scheduleTest.store'

interface IExamStore {
  isLoading: boolean
  examSeatInfo: ISeat | null
  activeSection: TestSection | null
  completedSections: Set<TestSection>
  currentExam: IExam | null

  setCurrentSession: (exam: IExam) => void
  fetchCurrentSession: (sessionId: string) => Promise<void>
  setExamSeatInfo: (seat: ISeat) => void
  startSession: (sessionId: string) => Promise<void>
  startSection: (seesionId: string, sectionId: string) => Promise<void>
  completeSection: (section: TestSection) => void
}

const useExamStore = create<IExamStore>((set, get) => ({
  isLoading: false,
  examSeatInfo: null,
  activeSection: null,
  completedSections: new Set<TestSection>(),
  currentExam: null,

  setCurrentSession: (exam: IExam) => set({ currentExam: exam }),
  fetchCurrentSession: async (sessionId: string) => {
    try {
      const response = await httpClient.get(`/exams/${sessionId}`)
      get().setCurrentSession(response)
    } catch (error) {
      toastError({ title: 'Failed to fetch current exam', error })
    }
  },
  setExamSeatInfo: (seat: ISeat) => set({ examSeatInfo: seat }),
  startSession: async (sessionId: string) => {
    set({ isLoading: true })
    try {
      const examUpdated: any = await httpClient.post(
        `/exams/${sessionId}/start`,
        {},
      )

      set({ currentExam: examUpdated })

      useScheduleTestStore.getState().updateLocalSession(sessionId, examUpdated)
    } catch (error) {
      toastError({ title: 'Failed to start exam exam', error })
    } finally {
      set({ isLoading: false })
    }
  },
  startSection: async (sessionId: string, sectionId: string) => {
    try {
      set({ isLoading: true })
      const sectionStarted = await httpClient.post(
        `exams/${sessionId}/sections/${sectionId}/start`,
        {},
      )
      console.log('Exam started response', sectionStarted)
    } catch (error) {
      toastError({ title: 'Failed to start section', error })
    } finally {
      set({ isLoading: false })
    }
  },
  completeSection: (section: TestSection) =>
    set(state => ({
      completedSections: new Set([...state.completedSections, section]),
    })),
}))

export default useExamStore
