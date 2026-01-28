import { useEffect } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'
import { Calendar, Trash2, Play } from 'lucide-react'
import { ExamSessionStatus } from '@/../prisma/generated/enums'
import { useScheduleTestStore } from '@/stores/scheduleTest.store'
import ScheduledTestHeader from './ScheduledTestHeader'
import { ScheduleTestFormDialog } from './ScheduleTestFormDialog'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import { useTenantStore } from '@/stores/tenant.store'
import useExamStore from '@/stores/exam.store'

export function ScheduleTestPage() {
  const { startSession } = useExamStore()
  const { fetchAvailableTests, sessions, deleteSession } =
    useScheduleTestStore()
  const { tenant } = useTenantStore()
  const router = useRouter()

  const handleDeleteScheduledTest = async (sessionId: string) => {
    await deleteSession(sessionId)
  }

  const handleStartScheduledTest = async (sessionId: string) => {
    await startSession(sessionId)
    router.push(`/admin/${sessionId}/control`)
  }

  useEffect(() => {
    fetchAvailableTests()
  }, [fetchAvailableTests])

  if (!tenant || !sessions) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}

      <ScheduledTestHeader />

      {/* Scheduled tests table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Scheduled Mock Tests</h2>
            <p className="text-sm text-gray-600">
              Manage upcoming test sessions and seats allocations
            </p>
          </div>
          <ScheduleTestFormDialog />
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No scheduled tests yet</p>
            <p className="text-sm text-gray-500">
              Click &quot;Schedule New Test&quot; to create your first mock test
              session
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Date</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map(session => (
                <TableRow
                  key={session.id}
                  onClick={() => router.push(`/admin/${session.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(session.examDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="p-0 h-auto">
                          {session.seats.length} candidate
                          {session.seats.length !== 1 ? 's' : ''}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Scheduled Candidates</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 pt-4">
                          {session.seats.map(seat => (
                            <div
                              key={seat.id}
                              className="p-3 border rounded-lg"
                            >
                              <p className="font-medium">
                                {seat.candidateName}
                              </p>
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Contact:
                                  </p>
                                  <p>{seat.candidateContact}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Candidate Id:
                                  </p>
                                  <p>{seat.candidateId}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    Access Code:
                                  </p>
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                                    {seat.accessCode}
                                  </code>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Seat:
                                  </p>
                                  <p>{seat.label ?? 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        session.status === ExamSessionStatus.COMPLETED
                          ? 'default'
                          : session.status === ExamSessionStatus.IN_PROGRESS ||
                              session.status === ExamSessionStatus.OPEN
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteScheduledTest(session.id)}
                        disabled={
                          session.status !== ExamSessionStatus.COMPLETED
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      {session.status !== ExamSessionStatus.COMPLETED && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartScheduledTest(session.id)}
                        >
                          <Play className="w-4 h-4 text-green-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
