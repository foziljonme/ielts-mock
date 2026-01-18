import { ISession } from '@/types/sessions'
import { ITenant } from '@/types/tenant'
import { create } from 'zustand'

type AdminDashboardState = {
  isLoading: boolean
  error: string | null
  tenant: ITenant | null
  sessions: ISession[] | null
  totalSessions: number
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setTenant: (tenant: ITenant | null) => void
  fetchSessions: () => Promise<void>
}

export const useAdminDashboardStore = create<AdminDashboardState>()(set => ({
  isLoading: false,
  error: null,
  tenant: null,
  sessions: null,
  totalSessions: 0,
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  setTenant: (tenant: ITenant | null) => set({ tenant }),
  fetchSessions: async () => {
    try {
      const response = await fetch('/api/sessions')
      const data = await response.json()
      set({ sessions: data.results, totalSessions: data.pagination.totalItems })
    } catch (error) {
      set({ error: 'Failed to fetch sessions' })
    }
  },
}))
