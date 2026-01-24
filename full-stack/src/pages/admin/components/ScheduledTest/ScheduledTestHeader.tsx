import { Card } from '@/components/card'
import { Users, Clock, CheckCircle2 } from 'lucide-react'
import { useAdminDashboardStore } from '@/stores/adminDashboard.store'
import { useScheduleTestStore } from '@/stores/scheduleTest.store'

export default function ScheduledTestHeader() {
  const { tenant } = useAdminDashboardStore()
  const { totalSessions } = useScheduleTestStore()

  if (!tenant) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Seats</p>
            <p className="text-2xl font-semibold">{tenant.seatQuota}</p>
          </div>
          <Users className="w-8 h-8 text-blue-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Scheduled</p>
            <p className="text-2xl font-semibold">{totalSessions}</p>
          </div>
          <Clock className="w-8 h-8 text-orange-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Available</p>
            <p className="text-2xl font-semibold">
              {tenant.seatQuota - tenant.seatUsage}
            </p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
      </Card>
    </div>
  )
}
