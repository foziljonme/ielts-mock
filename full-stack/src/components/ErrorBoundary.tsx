// components/ErrorBoundary.tsx
'use client'
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Caught in boundary:', error, errorInfo)
  }

  public render() {
    return this.state.hasError ? (
      <p>Something went wrong.</p>
    ) : (
      this.props.children
    )
  }
}

export default ErrorBoundary
