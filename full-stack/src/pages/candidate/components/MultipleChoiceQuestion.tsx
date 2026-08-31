// @ts-nocheck
import { RadioGroup, RadioGroupItem } from '@/components/radio-group'
import { Question } from './types'
import { CircleCheck } from 'lucide-react'
import { Label } from '@/components/label'

interface Props {
  questions: Question[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, value: string) => void
  globalStartNumber: number
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export function MultipleChoiceQuestion({
  questions,
  answers,
  onAnswerChange,
  globalStartNumber,
}: Props) {
  return (
    <div className="space-y-5">
      {questions.map((q, i) => {
        const num = globalStartNumber + i
        const answered = !!answers[q.id]
        // Strip any embedded Part header from the question text
        const lines = q.question.split('\n')
        const questionText = lines[lines.length - 1]

        return (
          <div
            key={q.id}
            className={`p-4 rounded-xl border-2 transition-all ${
              answered
                ? 'border-green-200 bg-green-50'
                : 'border-gray-100 bg-white'
            }`}
          >
            {/* Question stem */}
            <div className="flex items-start gap-3 mb-4">
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  answered
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {num}
              </span>
              <p className="text-sm text-gray-800 leading-relaxed">
                {questionText}
              </p>
              {answered && (
                <CircleCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              )}
            </div>

            {/* Options */}
            <RadioGroup
              value={answers[q.id] || ''}
              onValueChange={val => onAnswerChange(q.id, val)}
              className="ml-10 space-y-2"
            >
              {(q.options ?? []).map((opt, oi) => {
                const letter = OPTION_LETTERS[oi]
                const isSelected = answers[q.id] === opt
                return (
                  <div
                    key={oi}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-green-100 border border-green-300'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => onAnswerChange(q.id, opt)}
                  >
                    {/* <RadioGroupItem value={opt} id={`${q.id}-${oi}`} /> */}
                    <Label
                      htmlFor={`${q.id}-${oi}`}
                      className="text-sm cursor-pointer font-normal flex items-center gap-2"
                    >
                      <span
                        className={`font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {letter}
                      </span>
                      {opt}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
        )
      })}
    </div>
  )
}
