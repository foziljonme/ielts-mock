import { Header } from './components/Header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {children}
    </div>
  )
}
