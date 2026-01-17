// context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
import httpClient from '@/lib/httpClient'

interface AuthContextType {
  user: any
  seat: any
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  seat: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [seat, setSeat] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch current user on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then(data => setUser(data))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await httpClient.post('/auth/login', {
        email,
        password,
      })

      setUser(res.data.user)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setLoading(false)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, seat, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
