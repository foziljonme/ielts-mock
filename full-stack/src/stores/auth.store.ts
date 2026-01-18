// src/stores/auth.store.ts
import { IUser } from '@/types/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  user: IUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: IUser | null) => void
  setLoading: (value: boolean) => void
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

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    { name: 'auth-store' },
  ),
)
