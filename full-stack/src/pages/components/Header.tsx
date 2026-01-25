import { Button } from '@/components/button'
import { useAuthStore } from '@/stores/auth.store'
import { useTenantStore } from '@/stores/tenant.store'
import { Building2, Download, LogOut } from 'lucide-react'
import { useRouter } from 'next/router'

export function Header() {
  const { tenant } = useTenantStore()
  const { logout, user, seat } = useAuthStore()
  const router = useRouter()

  if (!tenant) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    if (router.pathname.startsWith('/candidate')) {
      router.push('/candidate/login')
      return
    }

    router.push('/admin/login')
  }

  return (
    <div className="bg-white border-b px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold">{tenant.name}</h1>
              {/* <p className="text-sm text-gray-600">{tenant.location}</p> */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <Badge variant="outline" className="text-sm">
                {tenant.agreement}
              </Badge> */}
            {user && (
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
