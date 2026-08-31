// @ts-nocheck
import { Input } from '@/components/input'
import { ListeningQuestionGroup, Question, TableCell } from './types'
import { Table2, FileText } from 'lucide-react'

interface Props {
  group: ListeningQuestionGroup
  questions: Question[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, value: string) => void
  globalStartNumber: number
}

// ── Shared blank input ────────────────────────────────────────────────────────
function BlankInput({
  questionId,
  num,
  answers,
  onAnswerChange,
  wordLimit,
}: {
  questionId: string
  num: number
  answers: Record<string, string>
  onAnswerChange: (id: string, val: string) => void
  wordLimit?: number
}) {
  const val = answers[questionId] || ''
  const answered = !!val
  return (
    <span className="inline-flex items-center gap-1 mx-0.5 relative">
      <span className="absolute -top-3.5 left-1 text-[9px] font-bold text-blue-500">
        {num}
      </span>
      <Input
        value={val}
        onChange={e => onAnswerChange(questionId, e.target.value)}
        placeholder="____"
        className={`inline-block h-7 text-xs px-1.5 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent focus:ring-0 min-w-[60px] max-w-[120px] transition-colors ${
          answered
            ? 'border-green-400 text-green-700 font-semibold'
            : 'border-blue-300'
        }`}
      />
      {wordLimit && (
        <span className="text-[9px] text-gray-300 whitespace-nowrap">
          {wordLimit}w
        </span>
      )}
    </span>
  )
}

// ── Table Completion ──────────────────────────────────────────────────────────
function TableCompletion({
  group,
  questions,
  answers,
  onAnswerChange,
  globalStartNumber,
}: Props) {
  const qList = questions
  const qNumMap: Record<string, number> = {}
  qList.forEach((q, i) => {
    qNumMap[q.id] = globalStartNumber + i
  })
  const qWordLimit: Record<string, number> = {}
  qList.forEach(q => {
    qWordLimit[q.id] = q.wordLimit ?? 2
  })

  const renderCell = (cell: TableCell) => {
    if (cell.questionId) {
      return (
        <span className="inline-flex items-baseline gap-0.5 flex-wrap">
          {cell.prefix && <span className="text-gray-700">{cell.prefix}</span>}
          <BlankInput
            questionId={cell.questionId}
            num={qNumMap[cell.questionId]}
            answers={answers}
            onAnswerChange={onAnswerChange}
            wordLimit={qWordLimit[cell.questionId]}
          />
          {cell.suffix && <span className="text-gray-700">{cell.suffix}</span>}
        </span>
      )
    }
    return <span className="text-gray-700">{cell.text}</span>
  }

  return (
    <div className="space-y-3">
      {group.tableTitle && (
        <div className="flex items-center gap-2 bg-gray-800 text-white rounded-t-xl px-4 py-2.5">
          <Table2 className="w-4 h-4 opacity-70" />
          <span className="text-sm font-semibold">{group.tableTitle}</span>
        </div>
      )}
      <div
        className={`overflow-x-auto border-2 border-gray-200 ${group.tableTitle ? 'rounded-b-xl' : 'rounded-xl'}`}
      >
        <table className="w-full text-sm border-collapse">
          {group.tableHeaders && (
            <thead>
              <tr className="bg-gray-100">
                {group.tableHeaders.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-4 py-2.5 text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-100">
            {group.tableRows?.map((row, ri) => (
              <tr
                key={ri}
                className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
              >
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3">
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Note Completion ───────────────────────────────────────────────────────────
function NoteCompletion({
  group,
  questions,
  answers,
  onAnswerChange,
  globalStartNumber,
}: Props) {
  const qNumMap: Record<string, number> = {}
  questions.forEach((q, i) => {
    qNumMap[q.id] = globalStartNumber + i
  })
  const qWordLimit: Record<string, number> = {}
  questions.forEach(q => {
    qWordLimit[q.id] = q.wordLimit ?? 2
  })

  return (
    <div className="space-y-3">
      {group.noteTitle && (
        <div className="flex items-center gap-2 bg-amber-700 text-white rounded-t-xl px-4 py-2.5">
          <FileText className="w-4 h-4 opacity-70" />
          <span className="text-sm font-semibold">{group.noteTitle}</span>
        </div>
      )}
      <div
        className={`border-2 border-amber-200 bg-amber-50 p-5 ${group.noteTitle ? 'rounded-b-xl' : 'rounded-xl'}`}
      >
        {group.noteBlocks?.map((block, bi) => (
          <div key={bi} className="mb-4 last:mb-0">
            {block.heading && (
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                {block.heading}
              </p>
            )}
            <ul className="space-y-3">
              {block.items.map((item, ii) => (
                <li
                  key={ii}
                  className={`flex items-baseline gap-0.5 flex-wrap text-sm text-gray-800 ${
                    item.isSubBullet
                      ? 'ml-6 before:content-["◦"] before:mr-2 before:text-gray-400'
                      : 'before:content-["•"] before:mr-2 before:text-amber-600'
                  }`}
                >
                  {item.prefix && <span>{item.prefix}</span>}
                  {item.questionId && (
                    <BlankInput
                      questionId={item.questionId}
                      num={qNumMap[item.questionId]}
                      answers={answers}
                      onAnswerChange={onAnswerChange}
                      wordLimit={qWordLimit[item.questionId]}
                    />
                  )}
                  {item.suffix && <span>{item.suffix}</span>}
                  {item.text && <span>{item.text}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Exported component — dispatches to table or note variant ──────────────────
export function NoteTableCompletionQuestion(props: Props) {
  if (props.group.type === 'table-completion') {
    return <TableCompletion {...props} />
  }
  return <NoteCompletion {...props} />
}
