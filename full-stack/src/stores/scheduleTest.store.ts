import { IAvailableTest } from '@/types/seats'
import { ISession, ISessionInput } from '@/types/sessions'
import { create } from 'zustand'
import httpClient from '@/lib/httpClient'
import { toastError } from '@/lib/notifications/toastError'
import { useTenantStore } from './tenant.store'

type ScheduleTestStore = {
  isLoading: boolean
  availableTests: IAvailableTest[]
  sessions: ISession[]
  totalSessions: number

  fetchSessions: () => Promise<void>
  fetchAvailableTests: () => Promise<void>
  createSession: (session: ISessionInput) => Promise<void>
  deleteSession: (sessionId: string) => Promise<void>
  updateLocalSession: (sessionId: string, session: ISession) => void
}

export const useScheduleTestStore = create<ScheduleTestStore>()((set, get) => ({
  isLoading: false,
  availableTests: [],
  sessions: [],
  totalSessions: 0,
  updateLocalSession: (sessionId: string, session: ISession) => {
    set({
      sessions: get().sessions.map(s =>
        s.id === sessionId ? { ...s, ...session } : s,
      ),
    })
  },
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
      set(state => ({
        sessions: [response, ...state.sessions],
        totalSessions: state.totalSessions + 1,
      }))
      useTenantStore.getState().appendSeats(response.seats.length)
    } catch (error) {
      toastError({ title: 'Failed to create exam session', error })
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
      useTenantStore.getState().removeSeats(session?.seats.length || 0)
    } catch (error) {
      toastError({ title: 'Failed to delete exam session', error })
    } finally {
      set({ isLoading: false })
    }
  },
}))
