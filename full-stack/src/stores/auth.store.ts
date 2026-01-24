// src/stores/auth.store.ts
import httpClient from '@/lib/httpClient'
import { IUser } from '@/types/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAdminDashboardStore } from './adminDashboard.store'
import { toast } from 'sonner'
import { toastError } from '@/lib/notifications/toastError'

type AuthState = {
  user: IUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: IUser | null) => void
  setLoading: (value: boolean) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setLoading: value => set({ isLoading: value }),

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          await httpClient
            .post('/auth/login', {
              email,
              password,
            })
            .then(res => {
              const { tenant, user } = res
              set({ user, isAuthenticated: true })
              useAdminDashboardStore.getState().setTenant(tenant)
            })
          toast.success('Login successful')
          return true
        } catch (error: any) {
          toastError({ title: 'Login failed', error })
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    { name: 'auth-store' },
  ),
)
