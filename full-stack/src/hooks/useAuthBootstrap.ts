// src/hooks/useAuthBootstrap.ts
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { IUser } from '@/types/user'
import httpClient from '@/lib/httpClient'
import { ITenant } from '@/types/tenant'
import { useAdminDashboardStore } from '@/stores/adminDashboard.store'

type UserResponse = IUser & { tenant: ITenant }

export function useAuthBootstrap() {
  const setUser = useAuthStore(s => s.setUser)
  const setTenant = useAdminDashboardStore(s => s.setTenant)
  const setLoading = useAuthStore(s => s.setLoading)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const user = await httpClient.get<UserResponse>('/auth/me')

        const { tenant, ...rest } = user
        if (!cancelled) {
          setUser(rest)
          setTenant(tenant)
        }
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [setUser, setLoading])
}
