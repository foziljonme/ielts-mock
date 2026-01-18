'use client'

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'

export default function App({ Component, pageProps }: AppProps) {
  useAuthBootstrap()

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}
