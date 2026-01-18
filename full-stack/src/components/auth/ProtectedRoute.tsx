// src/components/auth/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthStore } from '@/stores/auth.store'

type Props = {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return null // or spinner
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
