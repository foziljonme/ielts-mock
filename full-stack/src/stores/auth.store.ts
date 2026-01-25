// src/stores/auth.store.ts
import httpClient from '@/lib/httpClient'
import { IUser } from '@/types/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { toastError } from '@/lib/notifications/toastError'
import { toastSuccess } from '@/lib/notifications/toastSuccess'
import { ISeat } from '@/types/seats'
import { ITenant } from '@/types/tenant'
import { useTenantStore } from './tenant.store'

export enum AuthType {
  CANDIDATE,
  ADMIN,
}

type AuthState = {
  user: IUser | null
  seat: ISeat | null
  isAuthenticated: boolean
  type: AuthType | null
  isLoading: boolean
  hasHydrated: boolean
  setHydrated: (value: boolean) => void
  setUser: (user: IUser | null) => void
  setLoading: (value: boolean) => void
  login: (email: string, password: string) => Promise<boolean>
  restoreAuth: () => Promise<boolean>
  loginCandidate: (accessCode: string, candidateId: string) => Promise<boolean>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      seat: null,
      isAuthenticated: false,
      type: null,
      isLoading: true,
      hasHydrated: false,
      setHydrated: value => set({ hasHydrated: value }),

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
              set({ user, isAuthenticated: true, type: AuthType.ADMIN })
              useTenantStore.getState().setTenant(tenant)
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

      restoreAuth: async () => {
        set({ isLoading: true })
        const authType = get().type

        try {
          if (authType === AuthType.ADMIN) {
            const response = await httpClient.get('/auth/me')
            set({
              user: response.user,
              isAuthenticated: !!response.user,
              type: authType,
            })
            useTenantStore.getState().setTenant(response.tenant)
            return true
          } else if (authType === AuthType.CANDIDATE) {
            const response = await httpClient.get('/auth/candidate/me')
            set({
              seat: response.seat,
              isAuthenticated: !!response.seat,
              type: authType,
            })
            useTenantStore.getState().setTenant(response.tenant)
            return true
          } else {
            return false
          }
        } catch (error: any) {
          toastError({ title: 'Get me failed', error })
          set({ isAuthenticated: false, user: null, seat: null, type: null })
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      loginCandidate: async (accessCode: string, candidateId: string) => {
        set({ isLoading: true })
        try {
          await httpClient
            .post('/auth/candidate/login', {
              accessCode,
              candidateId,
            })
            .then(res => {
              const { tenant, seat } = res
              set({ seat, isAuthenticated: true, type: AuthType.CANDIDATE })
              useTenantStore.getState().setTenant(tenant)
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

      logout: async () => {
        await httpClient
          .post('/auth/logout', {})
          .then(() => {
            set({
              user: null,
              isAuthenticated: false,
            })
            useTenantStore.getState().setTenant(null)

            toastSuccess({ title: 'Logout successful' })
          })
          .catch((error: any) => {
            toastError({ title: 'Logout failed', error })
          })
      },
    }),
    {
      name: 'auth-store',
      partialize: state => ({
        type: state.type,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        seat: state.seat,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('rehydration error', error)
          return
        }

        // ✅ Use setState via `set`, NOT via the store variable
        state && state.setLoading(false)

        // ✅ THIS is the important line
        state && state.setHydrated(true) // triggers subscribers
      },
    },
  ),
)
