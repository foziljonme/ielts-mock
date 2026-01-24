import { IAvailableTest } from '@/types/seats'
import { ISession, ISessionInput } from '@/types/sessions'
import { create } from 'zustand'
import { useAdminDashboardStore } from './adminDashboard.store'
import httpClient from '@/lib/httpClient'
import { toastSuccess } from '@/lib/notifications/toastSuccess'
import { toastError } from '@/lib/notifications/toastError'

type ScheduleTestStore = {
  isLoading: boolean
  error: string | null
  availableTests: IAvailableTest[]
  sessions: ISession[]
  totalSessions: number
  scheduledTest: ISession | null
  fetchSessions: () => Promise<void>
  fetchAvailableTests: () => Promise<void>
  createSession: (session: ISessionInput) => Promise<void>
  startSession: (sessionId: string) => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
}

export const useScheduleTestStore = create<ScheduleTestStore>()((set, get) => ({
  isLoading: false,
  error: null,
  availableTests: [],
  sessions: [],
  totalSessions: 0,
  scheduledTest: null,
  fetchSessions: async () => {
    try {
      const response = await httpClient.get('/sessions')
      set({
        sessions: response.results,
        totalSessions: response.pagination.totalItems,
      })
    } catch (error) {
      toastError({ title: 'Failed to fetch sessions', error })
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
  createSession: async (session: ISessionInput) => {
    set({ isLoading: true })
    try {
      const response = await httpClient.post('/sessions', session)
      console.log(response)
      set(state => ({
        sessions: [response, ...state.sessions],
        totalSessions: state.totalSessions + 1,
      }))
      useAdminDashboardStore.getState().appendSeats(response.seats.length)
    } catch (error) {
      toastError({ title: 'Failed to create exam session', error })
    } finally {
      set({ isLoading: false })
    }
  },
  startSession: async (sessionId: string) => {
    set({ isLoading: true })
    try {
      const sessionUpdated = await httpClient.post(
        `/sessions/${sessionId}/start`,
        {},
      )
      set(state => {
        const updatedSessions = state.sessions.map(session =>
          session.id === sessionId
            ? { ...session, ...sessionUpdated }
            : session,
        )
        return {
          sessions: updatedSessions,
          scheduledTest:
            updatedSessions.find(session => session.id === sessionId) ?? null,
        }
      })
      toastSuccess({ title: 'Exam session started successfully' })
    } catch (error) {
      toastError({ title: 'Failed to start exam session', error })
    } finally {
      set({ isLoading: false })
    }
  },
  deleteSession: async (sessionId: string) => {
    set({ isLoading: true })
    try {
      const session = get().sessions.find(session => session.id === sessionId)
      await httpClient.delete(`/sessions/${sessionId}`)

      set(state => ({
        sessions: state.sessions.filter(session => session.id !== sessionId),
        totalSessions: state.totalSessions - 1,
      }))
      useAdminDashboardStore.getState().removeSeats(session?.seats.length || 0)
    } catch (error) {
      toastError({ title: 'Failed to delete exam session', error })
    } finally {
      set({ isLoading: false })
    }
  },
}))
