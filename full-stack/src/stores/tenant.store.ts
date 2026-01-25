import { ITenant } from '@/types/tenant'
import { create } from 'zustand'

type TenantState = {
  isLoading: boolean
  tenant: ITenant | null
  setLoading: (isLoading: boolean) => void
  setTenant: (tenant: ITenant | null) => void
  appendSeats: (count: number) => void
  removeSeats: (count: number) => void
}

export const useTenantStore = create<TenantState>()(set => ({
  isLoading: false,
  tenant: null,
  setLoading: (isLoading: boolean) => set({ isLoading }),
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
