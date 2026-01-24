import { ISession } from '@/types/sessions'
import { ITenant } from '@/types/tenant'
import { create } from 'zustand'

type AdminDashboardState = {
  isLoading: boolean
  error: string | null
  tenant: ITenant | null
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setTenant: (tenant: ITenant | null) => void
  appendSeats: (count: number) => void
  removeSeats: (count: number) => void
}

export const useAdminDashboardStore = create<AdminDashboardState>()(set => ({
  isLoading: false,
  error: null,
  tenant: null,
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  setTenant: (tenant: ITenant | null) => set({ tenant }),
  appendSeats: (count: number) =>
    set(state => ({
      tenant: {
        ...state.tenant!,
        seatUsage: state.tenant!.seatUsage + count,
      },
    })),
  removeSeats: (count: number) =>
    set(state => ({
      tenant: {
        ...state.tenant!,
        seatUsage: state.tenant!.seatUsage - count,
      },
    })),
}))
