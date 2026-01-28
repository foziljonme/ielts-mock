import { ISeat } from '@/types/seats'
import { create } from 'zustand'
import { TestSection } from '../../prisma/generated/enums'
import { ISession } from '@/types/sessions'
import { toastError } from '@/lib/notifications/toastError'
import httpClient from '@/lib/httpClient'
import { useScheduleTestStore } from './scheduleTest.store'

interface IExamStore {
  isLoading: boolean
  examSeatInfo: ISeat | null
  activeSection: TestSection | null
  completedSections: Set<TestSection>
  currentSession: ISession | null

  setCurrentSession: (session: ISession) => void
  fetchCurrentSession: (sessionId: string) => Promise<void>
  setExamSeatInfo: (seat: ISeat) => void
  startSession: (sessionId: string) => Promise<void>
  startSection: (section: TestSection) => void
  completeSection: (section: TestSection) => void
}

const useExamStore = create<IExamStore>(set => ({
  isLoading: false,
  examSeatInfo: null,
  activeSection: null,
  completedSections: new Set<TestSection>(),
  currentSession: null,

  setCurrentSession: (session: ISession) => set({ currentSession: session }),
  fetchCurrentSession: async (sessionId: string) => {
    try {
      const response = await httpClient.get(`/sessions/${sessionId}`)
      set({ currentSession: response })
    } catch (error) {
      toastError({ title: 'Failed to fetch current session', error })
    }
  },
  setExamSeatInfo: (seat: ISeat) => set({ examSeatInfo: seat }),
  startSession: async (sessionId: string) => {
    set({ isLoading: true })
    try {
      const sessionUpdated = await httpClient.post(
        `/sessions/${sessionId}/start`,
        {},
      )

      set({
        currentSession: sessionUpdated,
      })

      useScheduleTestStore
        .getState()
        .updateLocalSession(sessionId, sessionUpdated)
    } catch (error) {
      toastError({ title: 'Failed to start exam session', error })
    } finally {
      set({ isLoading: false })
    }
  },
  startSection: (section: TestSection) => set({ activeSection: section }),
  completeSection: (section: TestSection) =>
    set(state => ({
      completedSections: new Set([...state.completedSections, section]),
    })),
}))

export default useExamStore
