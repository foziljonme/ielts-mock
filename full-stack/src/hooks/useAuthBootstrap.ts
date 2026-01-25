// src/hooks/useAuthBootstrap.ts
import { useEffect } from 'react'
import { AuthType, useAuthStore } from '@/stores/auth.store'
import { useTenantStore } from '@/stores/tenant.store'

export function useAuthBootstrap() {
  const restoreAuth = useAuthStore(s => s.restoreAuth)
  const setUser = useAuthStore(s => s.setUser)
  const setLoading = useAuthStore(s => s.setLoading)
  const hasHydrated = useAuthStore(s => s.hasHydrated)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        if (hasHydrated) {
          await restoreAuth()
        }
      } catch {
        if (!cancelled) {
          setUser(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [setUser, setLoading, hasHydrated])
}
