import { useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Badge } from '@/components/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'
import { Alert, AlertDescription } from '@/components/alert'
import { Plus, AlertCircle, Minus } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ISessionInput } from '@/types/sessions'
import { useScheduleTestStore } from '@/stores/scheduleTest.store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { useTenantStore } from '@/stores/tenant.store'

type CandidateForm = {
  candidateName: string
  candidateContact: string
  label?: string
}

type ExamForm = {
  test: string
  examDate: string
  candidates: CandidateForm[]
}

export function ScheduleTestFormDialog() {
  const { createSession, availableTests, fetchAvailableTests, sessions } =
    useScheduleTestStore()
  const { tenant } = useTenantStore()

  const { formState, register, handleSubmit, control, reset, setValue } =
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

  const { errors } = formState

  const [showNewTestDialog, setShowNewTestDialog] = useState(false)

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
    return await handleSubmit(async data => {
      const newTest: ISessionInput = {
        testId: data.test,
        examDate: data.examDate,
        seats: data.candidates,
      }
      await createSession(newTest)

      // Reset form
      reset()
      setShowNewTestDialog(false)
    })()
  }

  useEffect(() => {
    fetchAvailableTests()
  }, [fetchAvailableTests])

  if (!tenant || !sessions) {
    return null
  }

  const emailOrPhoneRegex = /^([^\s@]+@[^\s@]+\.[^\s@]+|\+?[0-9\s\-().]{7,20})$/

  return (
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
            <Label htmlFor="testDate">Exam Date</Label>
            <Input
              id="testDate"
              type="datetime-local"
              error={errors.examDate}
              {...register('examDate', {
                required: 'Exam date is required',
              })}
              // value={testDate}
              // onChange={e => setTestDate(e.target.value)}
              // min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Select Test ID */}
          <div>
            <Label htmlFor="test">Select Test</Label>
            <Select
              {...register('test', {
                required: 'Test is required',
              })}
              onValueChange={value => {
                setValue('test', value)
              }}
            >
              <SelectTrigger error={errors.test}>
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent>
                {availableTests.map(test => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                      required:
                        'Candidate name is required, remove this candidate if you dont want to add',
                    })}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    {...register(`candidates.${index}.candidateContact`, {
                      required:
                        'Candidate contact is required, remove this candidate if you dont want to add',
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
                  <Button
                    type="button"
                    onClick={() => handleRemoveStudent(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" onClick={handleAddStudent} className="w-full">
              <Plus className="w-4 h-4" />
              Add Candidate
            </Button>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
              <span className="text-sm">Candidates to be scheduled:</span>
              <Badge variant="secondary">{candidates.length}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm">Remaining seats after scheduling:</span>
              <Badge
                variant={
                  tenant.seatQuota - tenant.seatUsage - candidates.length >= 0
                    ? 'default'
                    : 'destructive'
                }
              >
                {tenant.seatQuota - tenant.seatUsage - candidates.length}
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
              // disabled={candidates.length === 0 || !isReady}
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
  )
}
