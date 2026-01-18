import React, { useState } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
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
import { Alert, AlertDescription } from '@/components/alert'
import {
  Calendar,
  Plus,
  Trash2,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react'
import { useAdminDashboardStore } from '@/stores/adminDashboard.store'
import { ExamSessionStatus } from '@/../prisma/generated/enums'
import { useFieldArray, useForm } from 'react-hook-form'
import { ISession, ISessionInput } from '@/types/sessions'

type CandidateForm = {
  candidateName: string
  candidateContact: string
  label?: string
}

type ExamForm = {
  testName: string
  test: string
  examDate: string
  candidates: CandidateForm[]
}

export function ScheduleTestPage() {
  const { formState, register, handleSubmit, control, reset } =
    useForm<ExamForm>({
      defaultValues: {
        examDate: '',
        candidates: [
          {
            candidateName: '',
            candidateContact: '',
          },
        ],
      },
    })
  const {
    fields: candidates,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'candidates',
  })

  const { errors, isReady } = formState

  const { tenant, sessions, totalSessions } = useAdminDashboardStore()
  const [showNewTestDialog, setShowNewTestDialog] = useState(false)
  console.log({ sessions, tenant })

  const availableStudents = []

  const handleAddStudent = () => {
    append({
      candidateName: '',
      candidateContact: '',
    })
  }

  const handleRemoveStudent = (index: number) => {
    remove(index)
  }

  const handleScheduleTest = async () => {
    return await handleSubmit(data => {
      console.log({ data })

      // if (data.candidates.length > tenant!.seatQuota) {
      //   setError(
      //     `Not enough test attempts. You have ${tenant!.seatQuota} remaining.`,
      //   )
      //   return
      // }

      const newTest: ISessionInput = {
        name: data.testName,
        testId: data.test,
        examDate: data.examDate,
        seats: data.candidates.map((s, idx) => {
          return {
            candidateName: s.candidateName,
            candidateContact: s.candidateContact,
            label: s.label,
          }
        }),
      }

      // setScheduledTests([...scheduledTests, newTest])

      // // Reset form
      // setTestDate('')
      // setSelectedStudents([])
      // setError('')
      setShowNewTestDialog(false)
    })()
  }

  const handleDeleteScheduledTest = (testId: string) => {
    setScheduledTests(scheduledTests.filter(t => t.id !== testId))
  }

  if (!tenant || !sessions) {
    return null
  }

  const emailOrPhoneRegex = /^([^\s@]+@[^\s@]+\.[^\s@]+|\+?[0-9\s\-().]{7,20})$/
  console.log({ errors })
  return (
    <div className="space-y-6">
      {/* Header with stats */}
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

      {/* Scheduled tests table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Scheduled Mock Tests</h2>
            <p className="text-sm text-gray-600">
              Manage upcoming test sessions and seats allocations
            </p>
          </div>
          <Dialog open={showNewTestDialog} onOpenChange={setShowNewTestDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Schedule New Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Mock Test</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Exam date */}
                <div>
                  <Label htmlFor="testName">Exam Name</Label>
                  <Input
                    id="testName"
                    type="text"
                    error={errors.testName}
                    {...register('testName', { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="testDate">Exam Date</Label>
                  <Input
                    id="testDate"
                    type="date"
                    error={errors.examDate}
                    {...register('examDate', { required: true })}
                    // value={testDate}
                    // onChange={e => setTestDate(e.target.value)}
                    // min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Add candidate form */}
                <div className="space-y-4">
                  <Label>Add Candidate</Label>

                  {candidates.map((field, index) => (
                    <div className="grid grid-cols-2 gap-4" key={field.id}>
                      <div>
                        <Input
                          placeholder="Candidate Name"
                          error={errors.candidates?.[index]?.candidateName}
                          {...register(`candidates.${index}.candidateName`, {
                            required: true,
                          })}
                          // value={studentName}
                          // onChange={e => setStudentName(e.target.value)}
                          // onKeyDown={e => e.key === 'Enter' && handleAddStudent()}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          {...register(`candidates.${index}.candidateContact`, {
                            required: true,
                            pattern: {
                              value: emailOrPhoneRegex,
                              message: 'Invalid phone number or email',
                            },
                          })}
                          placeholder="Student Contact"
                          error={errors.candidates?.[index]?.candidateContact}
                          // value={studentEmail}
                          // onChange={e => setStudentEmail(e.target.value)}
                          // onKeyDown={e =>
                          //   e.key === 'Enter' && handleAddStudent()
                          // }
                        />
                        <Button type="button" onClick={handleAddStudent}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Selected Candidates list */}
                  {/* {candidates.length > 0 && (
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {candidates.map((candidate, index) => {
                          const { candidateName, candidateContact } = candidate
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div>
                                <p className="font-medium text-sm">
                                  {candidateName}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {candidateContact}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveStudent(index)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )} */}

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <span className="text-sm">Candidates to be scheduled:</span>
                    <Badge variant="secondary">{candidates.length}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">
                      Remaining seats after scheduling:
                    </span>
                    <Badge
                      variant={
                        tenant.seatQuota - candidates.length >= 0
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {tenant.seatQuota - candidates.length}
                    </Badge>
                  </div>
                </div>

                {errors.examDate?.message ||
                  (errors.candidates?.message && (
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>
                        {errors.examDate?.message || errors.candidates?.message}
                      </AlertDescription>
                    </Alert>
                  ))}

                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={handleScheduleTest}
                    disabled={candidates.length === 0 || !isReady}
                  >
                    Schedule Test
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowNewTestDialog(false)
                      reset()
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No scheduled tests yet</p>
            <p className="text-sm text-gray-500">
              Click "Schedule New Test" to create your first mock test session
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
                <TableRow key={session.id}>
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
                                  <p>{seat.label}</p>
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
                          : session.status === ExamSessionStatus.IN_PROGRESS
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
                          session.status !== ExamSessionStatus.SCHEDULED
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      {session.status === ExamSessionStatus.SCHEDULED && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => console.log(session)}
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
