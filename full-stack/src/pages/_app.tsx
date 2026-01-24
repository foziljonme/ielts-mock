'use client'

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import { Toaster } from '@/components/sonner'

export default function App({ Component, pageProps }: AppProps) {
  useAuthBootstrap()

  return (
    <ErrorBoundary>
      <Toaster />
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
