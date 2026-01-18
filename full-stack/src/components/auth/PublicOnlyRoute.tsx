// src/components/auth/PublicOnlyRoute.tsx
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthStore } from '@/stores/auth.store'

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return null

  return <>{children}</>
}
