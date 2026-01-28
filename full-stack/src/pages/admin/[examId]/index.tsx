import React, { useEffect, useState } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
import { Badge } from '@/components/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs'
import {
  Users,
  ClipboardList,
  DollarSign,
  TrendingUp,
  Search,
  Download,
  Plus,
  Building2,
  LogOut,
} from 'lucide-react'
// import { ScheduleTestPage } from '@/admin/components/ScheduledTest'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ISession } from '@/types/sessions'
import { useScheduleTestStore } from '@/stores/scheduleTest.store'
import { useAuthStore } from '@/stores/auth.store'
import { AdminTestControl } from '../components/AdminTestControl'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'
import { useTenantStore } from '@/stores/tenant.store'
import useExamStore from '@/stores/exam.store'
// import { mockStudents, mockTestResults, mockTenants } from '../data/mockData'
// import { ScheduleTestPage } from './ScheduleTestPage'
// import { TestSubmissionsPage } from './TestSubmissionsPage'
// import { AdminTestControl } from './AdminTestControl'
// import { ScheduledTest } from '../types'

export function ExamDashboard() {
  const { logout } = useAuthStore()
  const { tenant } = useTenantStore()
  const { fetchCurrentSession } = useExamStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTestControl, setActiveTestControl] = useState<ISession | null>(
    null,
  )
  const router = useRouter()

  // const students = []
  // const results = []

  // const filteredStudents = students.filter(
  //   s =>
  //     s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  // )

  // const stats = {
  //   totalStudents: students.length,
  //   activeTests: students.filter(s => s.testStatus === 'in-progress').length,
  //   completedTests: results.length,
  //   testAttempts: tenant.testAttempts,
  // }

  const handleStartTest = (test: ISession) => {
    setActiveTestControl(test)
  }

  const handleBackFromControl = () => {
    setActiveTestControl(null)
  }

  useEffect(() => {
    const examId = router.query.examId as string
    if (!examId) return
    fetchCurrentSession(examId)
  }, [router.query.examId])

  if (!tenant) {
    return <Loading />
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Stats cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Total Test Seats
                </p>
                <p className="text-2xl font-semibold">
                  {stats.testAttempts.total}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.testAttempts.remaining} remaining
                </p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Total Students
                </p>
                <p className="text-2xl font-semibold">
                  {stats.totalStudents}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Active Tests
                </p>
                <p className="text-2xl font-semibold">
                  {stats.activeTests}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Completed
                </p>
                <p className="text-2xl font-semibold">
                  {stats.completedTests}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div> */}

      {/* Tabs */}
      <Tabs defaultValue="control" className="space-y-4">
        <TabsList>
          <TabsTrigger value="control">Control Panel</TabsTrigger>
          <TabsTrigger value="submissions">Test Submissions</TabsTrigger>
          <TabsTrigger value="students">Candidates</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="control">
          <AdminTestControl />
        </TabsContent>

        {/* Test Submissions Tab */}
        {/* <TabsContent value="submissions">
            <TestSubmissionsPage tenant={tenant} />
          </TabsContent> */}

        {/* Students Tab */}
        {/* <TabsContent value="students" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Student Management</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Access Code</TableHead>
                    <TableHead>Test Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Seat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-gray-600">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {student.accessCode || '-'}
                        </code>
                      </TableCell>
                      <TableCell>{student.testDate || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.testStatus === 'completed'
                              ? 'default'
                              : student.testStatus === 'in-progress'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {student.testStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.assignedSeat || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent> */}

        {/* Results Tab */}
        {/* <TabsContent value="results" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Test Results</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Listening</TableHead>
                    <TableHead>Reading</TableHead>
                    <TableHead>Writing</TableHead>
                    <TableHead>Speaking</TableHead>
                    <TableHead>Overall</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map(result => {
                    const student = students.find(
                      s => s.id === result.studentId,
                    )
                    return (
                      <TableRow key={result.id}>
                        <TableCell>{student?.name}</TableCell>
                        <TableCell>{result.testDate}</TableCell>
                        <TableCell>{result.sections.listening}</TableCell>
                        <TableCell>{result.sections.reading}</TableCell>
                        <TableCell>{result.sections.writing}</TableCell>
                        <TableCell>{result.sections.speaking}</TableCell>
                        <TableCell>
                          <Badge variant="default">{result.overallScore}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent> */}
      </Tabs>
    </div>
  )
}

const ProtectedExamDashboard = () => {
  return (
    <ProtectedRoute>
      <ExamDashboard />
    </ProtectedRoute>
  )
}

export default ProtectedExamDashboard
