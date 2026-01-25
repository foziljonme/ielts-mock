'use client'
// src/components/auth/ProtectedRoute.tsx
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthStore } from '@/stores/auth.store'
import Loading from '../Loading'

type Props = {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (router.pathname.startsWith('/admin')) {
        router.replace('/admin/login')
      } else if (router.pathname.startsWith('/candidate')) {
        router.replace('/candidate/login')
      }
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
