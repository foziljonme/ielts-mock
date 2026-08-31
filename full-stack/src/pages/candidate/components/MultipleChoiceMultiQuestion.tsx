// @ts-nocheck
import { Question } from './types'
import { CheckSquare, Square, AlertCircle } from 'lucide-react'

interface Props {
  group: { questionRange: [number, number]; instructions: string }
  questions: Question[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, value: string) => void
  globalStartNumber: number
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export function MultipleChoiceMultiQuestion({
  group,
  questions,
  answers,
  onAnswerChange,
  globalStartNumber,
}: Props) {
  // For this question type, the group may reference one question id (l26)
  // that represents a "choose N" block spanning multiple displayed question numbers.
  // We store selected letters as a comma-separated string.
  const q = questions[0]
  if (!q) return null

  const required = q.requiredAnswerCount ?? 2
  const [start, end] = group.questionRange
  const selectedStr = answers[q.id] || ''
  const selected: string[] = selectedStr
    ? selectedStr.split(',').filter(Boolean)
    : []

  const toggleOption = (letter: string) => {
    let next = [...selected]
    if (next.includes(letter)) {
      next = next.filter(l => l !== letter)
    } else {
      if (next.length >= required) {
        // Replace the oldest selection
        next = [...next.slice(1), letter]
      } else {
        next.push(letter)
      }
    }
    onAnswerChange(q.id, next.join(','))
  }

  const allSelected = selected.length === required

  // Strip the "Questions X and Y" header from the question text if present
  const lines = q.question.split('\n')
  const hasHeader = lines.length > 1
  const questionText = hasHeader ? lines.slice(1).join('\n') : q.question

  return (
    <div
      className={`p-5 rounded-xl border-2 transition-all ${
        allSelected
          ? 'border-green-200 bg-green-50'
          : 'border-blue-100 bg-blue-50/30'
      }`}
    >
      {/* Span label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
          Questions {start}–{end}
        </span>
        <span className="text-xs text-gray-500">Choose {required} answers</span>
        <span
          className={`ml-auto text-xs font-semibold ${
            allSelected
              ? 'text-green-600'
              : selected.length > 0
                ? 'text-amber-600'
                : 'text-gray-400'
          }`}
        >
          {selected.length}/{required} selected
        </span>
      </div>

      {/* Question text */}
      <p className="text-sm text-gray-800 leading-relaxed mb-4 font-medium">
        {questionText}
      </p>

      {/* Options (checkbox style) */}
      <div className="space-y-2">
        {(q.options ?? []).map((opt, oi) => {
          const letter = OPTION_LETTERS[oi]
          const isSelected = selected.includes(letter)
          return (
            <button
              key={oi}
              onClick={() => toggleOption(letter)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all border-2 ${
                isSelected
                  ? 'border-green-400 bg-green-100'
                  : 'border-transparent bg-white hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-green-600 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-gray-300 shrink-0" />
              )}
              <span
                className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {letter}
              </span>
              <span className="text-sm text-gray-800">{opt}</span>
            </button>
          )
        })}
      </div>

      {/* Hint */}
      {!allSelected && selected.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600">
          <AlertCircle className="w-3.5 h-3.5" />
          Select {required - selected.length} more answer
          {required - selected.length > 1 ? 's' : ''}
        </div>
      )}
      {allSelected && (
        <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-medium">
          <span>Selected:</span>
          {selected.map(l => (
            <span
              key={l}
              className="bg-green-500 text-white px-2 py-0.5 rounded-full font-bold"
            >
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
