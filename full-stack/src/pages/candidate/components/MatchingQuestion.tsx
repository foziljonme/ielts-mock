// @ts-nocheck
import { ListeningQuestionGroup, Question } from './types'
import { ArrowRight } from 'lucide-react'

interface Props {
  group: ListeningQuestionGroup
  questions: Question[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, value: string) => void
  globalStartNumber: number
}

export function MatchingQuestion({
  group,
  questions,
  answers,
  onAnswerChange,
  globalStartNumber,
}: Props) {
  const options = group.matchingOptions ?? []

  const qNumMap: Record<string, number> = {}
  questions.forEach((q, i) => {
    qNumMap[q.id] = globalStartNumber + i
  })

  return (
    <div className="space-y-4">
      {/* Options box */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
          Options
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map(opt => (
            <div
              key={opt.id}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="font-bold text-gray-900 w-5 shrink-0">
                {opt.id}
              </span>
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Matching items */}
      <div className="space-y-2">
        {questions.map(q => {
          const num = qNumMap[q.id]
          const val = answers[q.id] || ''
          const matchedOption = options.find(o => o.id === val)
          const answered = !!val

          return (
            <div
              key={q.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                answered
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-100 bg-white'
              }`}
            >
              {/* Question number */}
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  answered
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {num}
              </span>

              {/* Task text */}
              <span className="flex-1 text-sm text-gray-800">{q.question}</span>

              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />

              {/* Option selector */}
              <select
                value={val}
                onChange={e => onAnswerChange(q.id, e.target.value)}
                className={`text-sm font-semibold border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-300 transition-colors cursor-pointer ${
                  answered
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
                style={{ minWidth: '220px' }}
              >
                <option value="">Select an option…</option>
                {options.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.id} — {opt.label}
                  </option>
                ))}
              </select>

              {/* Confirmed badge */}
              {answered && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold shrink-0">
                  {val}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
