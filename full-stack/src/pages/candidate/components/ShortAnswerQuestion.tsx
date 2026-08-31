import { Input } from '@/components/input'
import { Question } from './types'
import { Pencil, CircleCheck } from 'lucide-react'

interface Props {
  questions: Question[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, value: string) => void
  globalStartNumber: number
}

export function ShortAnswerQuestion({
  questions,
  answers,
  onAnswerChange,
  globalStartNumber,
}: Props) {
  return (
    <div className="space-y-3">
      {questions.map((q, i) => {
        const num = globalStartNumber + i
        const val = answers[q.id] || ''
        const answered = !!val
        const wordCount = val.trim().split(/\s+/).filter(Boolean).length
        const limit = q.wordLimit ?? 3
        const overLimit = wordCount > limit

        return (
          <div
            key={q.id}
            className={`p-4 rounded-xl border-2 transition-all ${
              answered
                ? overLimit
                  ? 'border-red-200 bg-red-50'
                  : 'border-green-200 bg-green-50'
                : 'border-gray-100 bg-white'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  answered
                    ? overLimit
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {num}
              </span>
              <p className="text-sm text-gray-800 leading-relaxed flex-1">
                {q.question}
              </p>
              {answered && !overLimit && (
                <CircleCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              )}
            </div>

            <div className="ml-10 flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Pencil className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                <Input
                  value={val}
                  onChange={e => onAnswerChange(q.id, e.target.value)}
                  placeholder={`Answer in ${limit === 1 ? 'one word' : `up to ${limit} words`}…`}
                  className={`pl-7 text-sm h-9 ${
                    overLimit
                      ? 'border-red-400 focus:ring-red-200'
                      : 'border-gray-200'
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  overLimit
                    ? 'text-red-600'
                    : answered
                      ? 'text-green-600'
                      : 'text-gray-400'
                }`}
              >
                {wordCount}/{limit} {wordCount === 1 ? 'word' : 'words'}
              </span>
            </div>

            {overLimit && (
              <p className="ml-10 mt-1.5 text-xs text-red-600">
                Exceeds the word limit — write NO MORE THAN {limit}{' '}
                {limit === 1 ? 'word' : 'words'}.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
