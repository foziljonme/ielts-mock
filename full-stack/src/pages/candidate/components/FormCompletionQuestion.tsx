// @ts-nocheck
import { Input } from '@/components/input'
// import { ListeningQuestionGroup, Question } from '../../types'
import { FileText } from 'lucide-react'
import { IQuestion } from '@/types/exams'
import { QuestionGroupTemplate } from '../exam/[examId]/listening-old'

interface Props {
  group: QuestionGroupTemplate
  questions: IQuestion[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, value: string) => void
  globalStartNumber: number
}

export function FormCompletionQuestion({
  group,
  questions,
  answers,
  onAnswerChange,
  globalStartNumber,
}: Props) {
  const qMap = Object.fromEntries(questions.map(q => [q.id, q]))

  // Build a lookup: questionId → global question number
  const qNumMap: Record<string, number> = {}
  questions.forEach((q, i) => {
    qNumMap[q.id] = globalStartNumber + i
  })
  console.log('groupgroupgroup', group)
  return (
    <div className="space-y-4">
      {/* Form card */}
      <div className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
        {/* Form header */}
        <div className="bg-gray-800 text-white px-5 py-3 flex items-center gap-2">
          <FileText className="w-4 h-4 opacity-70" />
          <span className="text-sm font-semibold tracking-wide uppercase">
            {group.title ?? 'Completion Form'}
          </span>
        </div>

        <div className="bg-white divide-y divide-gray-100">
          {group.formSections?.map((section: any, si: any) => (
            <div key={si} className="p-5">
              {section.heading && (
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  {section.heading}
                </p>
              )}
              <div className="space-y-3">
                {section.fields.map((field: any) => {
                  const q = qMap[field.questionId]
                  const num = qNumMap[field.questionId]
                  const answered = !!answers[field.questionId]
                  return (
                    <div
                      key={field.questionId}
                      className="flex items-center gap-3 min-h-[42px]"
                    >
                      {/* Field label */}
                      <span className="text-sm text-gray-600 w-44 shrink-0">
                        {field.label}
                      </span>
                      <span className="text-gray-300 text-sm shrink-0">:</span>

                      {/* Prefix */}
                      {field.prefix && (
                        <span className="text-sm text-gray-700 shrink-0">
                          {field.prefix}
                        </span>
                      )}

                      {/* Answer input */}
                      <div className="relative flex items-center gap-1">
                        <span
                          className={`absolute -top-4 left-1 text-[10px] font-bold ${answered ? 'text-green-500' : 'text-blue-500'}`}
                        >
                          {num}
                        </span>
                        <Input
                          value={answers[field.questionId] || ''}
                          onChange={e =>
                            onAnswerChange(field.questionId, e.target.value)
                          }
                          placeholder={`...`}
                          className={`h-8 text-sm w-40 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent px-1 focus:ring-0 transition-colors ${
                            answered
                              ? 'border-green-400 text-green-700'
                              : 'border-blue-300'
                          }`}
                        />
                        {q?.wordLimit && (
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            max{' '}
                            {q.wordLimit === 1
                              ? '1 word'
                              : `${q.wordLimit} words`}
                          </span>
                        )}
                      </div>

                      {/* Suffix */}
                      {field.suffix && (
                        <span className="text-sm text-gray-700 shrink-0">
                          {field.suffix}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
