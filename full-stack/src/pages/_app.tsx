'use client'

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'
import { Toaster } from '@/components/sonner'
import { Layout } from './_layout'

export default function App({ Component, pageProps }: AppProps) {
  useAuthBootstrap()

  return (
    <Layout>
      <ErrorBoundary>
        <Toaster />
        <Component {...pageProps} />
      </ErrorBoundary>
    </Layout>
  )
}
