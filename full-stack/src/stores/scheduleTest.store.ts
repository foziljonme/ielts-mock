import { IAvailableTest } from '@/types/seats'
import { IExam, IExamInput } from '@/types/exams'
import { create } from 'zustand'
import httpClient from '@/lib/httpClient'
import { toastError } from '@/lib/notifications/toastError'
import { useTenantStore } from './tenant.store'

type ScheduleTestStore = {
  isLoading: boolean
  availableTests: IAvailableTest[]
  exams: IExam[]
  totalSessions: number

  fetchSessions: () => Promise<void>
  fetchAvailableTests: () => Promise<void>
  createSession: (exam: IExamInput) => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
  updateLocalSession: (sessionId: string, exam: IExam) => void
}

export const useScheduleTestStore = create<ScheduleTestStore>()((set, get) => ({
  isLoading: false,
  availableTests: [],
  exams: [],
  totalSessions: 0,
  updateLocalSession: (sessionId: string, exam: IExam) => {
    set({
      exams: get().exams.map(s => (s.id === sessionId ? { ...s, ...exam } : s)),
    })
  },
  fetchSessions: async () => {
    try {
      const response = await httpClient.get('/exams')
      set({
        exams: response.results,
        totalSessions: response.pagination.totalItems,
      })
    } catch (error) {
      toastError({ title: 'Failed to fetch exams', error })
    }
  },
  fetchAvailableTests: async () => {
    set({ isLoading: true })
    try {
      const response = await httpClient.get('/available-tests')
      set({ availableTests: response })
    } catch (error) {
      toastError({ title: 'Failed to fetch available tests', error })
    } finally {
      set({ isLoading: false })
    }
  },
  createSession: async (exam: IExamInput) => {
    set({ isLoading: true })
    try {
      const response = await httpClient.post('/exams', exam)
      set(state => ({
        sessions: [response, ...state.exams],
        totalSessions: state.totalSessions + 1,
      }))
      useTenantStore.getState().appendSeats(response.seats.length)
    } catch (error) {
      toastError({ title: 'Failed to create exam exam', error })
    } finally {
      set({ isLoading: false })
    }
  },
  deleteSession: async (sessionId: string) => {
    set({ isLoading: true })
    try {
      const exam = get().exams.find(exam => exam.id === sessionId)
      await httpClient.delete(`/exams/${sessionId}`)

      set(state => ({
        sessions: state.exams.filter(exam => exam.id !== sessionId),
        totalSessions: state.totalSessions - 1,
      }))
      useTenantStore.getState().removeSeats(exam?.seats.length || 0)
    } catch (error) {
      toastError({ title: 'Failed to delete exam exam', error })
    } finally {
      set({ isLoading: false })
    }
  },
}))
