import React, { useState } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Alert, AlertDescription } from '@/components/alert'
import { Building2, LogIn } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAuthStore()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    // Simple validation for demo
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    await login(email, password).then(isAuthenticated => {
      if (isAuthenticated) router.push('/admin/dashboard')
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Admin Portal</h1>
          <p className="text-gray-600">Sign in to manage your test center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@testcenter.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                setError('')
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setError('')
              }}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" size="lg">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-500 text-center mb-2">
            Demo Credentials:
          </p>
          <div
            className="bg-gray-50 p-3 rounded text-xs font-mono"
            onClick={() => {
              setEmail('admin@global-academy.com')
              setPassword('demo')
            }}
          >
            <p>Email: admin@global-academy.com</p>
            <p>Password: demo</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Need help? Contact IT support</p>
        </div>
      </Card>
    </div>
  )
}
