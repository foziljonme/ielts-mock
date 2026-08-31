import {
  ContentBlock,
  DiagramHotspot,
  InlineNode,
  LayoutTableCell,
  QuestionType,
  SectionQuestion,
} from '@/types'
import React, { Fragment } from 'react'
// import {
//   ContentBlock,
//   InlineNode,
//   LayoutTableCell,
//   SectionQuestion,
//   QuestionType,
//   DiagramHotspot,
// } from '../../types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ContentBlockRendererProps {
  blocks: ContentBlock[]
  groupType: QuestionType
  questionsById: Record<string, SectionQuestion>
  answersById: Record<string, string>
  onAnswerChange: (qid: string, val: string) => void
  onBlur: (qid: string, val: string) => void
}

// ─── Inline node renderer ─────────────────────────────────────────────────────

function renderInlineNode(
  node: InlineNode,
  key: number | string,
  groupType: QuestionType,
  questionsById: Record<string, SectionQuestion>,
  answersById: Record<string, string>,
  onAnswerChange: (qid: string, val: string) => void,
  onBlur: (qid: string, val: string) => void,
): React.ReactNode {
  if (node.kind === 'text') return <span key={key}>{node.text}</span>
  if (node.kind === 'emphasis')
    return (
      <em key={key} className="font-medium not-italic">
        {node.text}
      </em>
    )
  if (node.kind === 'blank')
    return (
      <InlineBlank
        key={key}
        questionId={node.questionId}
        questionsById={questionsById}
        answersById={answersById}
        onAnswerChange={onAnswerChange}
        onBlur={onBlur}
      />
    )
  return null
}

// ─── Inline blank input ───────────────────────────────────────────────────────

function InlineBlank({
  questionId,
  questionsById,
  answersById,
  onAnswerChange,
  onBlur,
}: {
  questionId: string
  questionsById: Record<string, SectionQuestion>
  answersById: Record<string, string>
  onAnswerChange: (qid: string, val: string) => void
  onBlur: (qid: string, val: string) => void
}) {
  const q = questionsById[questionId]
  const value = answersById[questionId] ?? ''
  return (
    <span className="flex items-center mx-1" id={`q-${questionId}`}>
      <span className="block text-[9px] font-bold text-blue-500 leading-none mb-0.5">
        {q?.order}
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onAnswerChange(questionId, e.target.value)}
        onBlur={e => onBlur(questionId, e.target.value)}
        className="block border-b-2 border-blue-400 bg-transparent focus:outline-none w-24 text-sm px-1 text-center"
        placeholder="..."
      />
    </span>
  )
}

// ─── Table cell renderer ──────────────────────────────────────────────────────

function TableCell({
  cell,
  groupType,
  questionsById,
  answersById,
  onAnswerChange,
  onBlur,
}: {
  cell: LayoutTableCell
  groupType: QuestionType
  questionsById: Record<string, SectionQuestion>
  answersById: Record<string, string>
  onAnswerChange: (qid: string, val: string) => void
  onBlur: (qid: string, val: string) => void
}) {
  const base = 'border border-gray-200 px-3 py-2 text-sm'
  if (cell.kind === 'text') {
    return (
      <td
        className={`${base} ${cell.header ? 'font-semibold bg-gray-50 text-gray-700' : 'text-gray-800'}`}
        colSpan={cell.colspan}
        rowSpan={cell.rowspan}
      >
        {cell.text}
      </td>
    )
  }
  if (cell.kind === 'blank') {
    return (
      <td className={base} colSpan={cell.colspan} rowSpan={cell.rowspan}>
        <InlineBlank
          questionId={cell.questionId}
          questionsById={questionsById}
          answersById={answersById}
          onAnswerChange={onAnswerChange}
          onBlur={onBlur}
        />
      </td>
    )
  }
  if (cell.kind === 'rich') {
    return (
      <td className={base} colSpan={cell.colspan} rowSpan={cell.rowspan}>
        {cell.content.map((node, i) =>
          renderInlineNode(
            node,
            i,
            groupType,
            questionsById,
            answersById,
            onAnswerChange,
            onBlur,
          ),
        )}
      </td>
    )
  }
  return null
}

// ─── Floor plan SVG ───────────────────────────────────────────────────────────

const FLOOR_PLAN_ROOMS = [
  { x: 10, y: 10, w: 150, h: 120, fill: '#fce7f3', label: 'CAFÉ' },
  {
    x: 160,
    y: 10,
    w: 200,
    h: 120,
    fill: '#e0f2fe',
    label: 'WORKSHOP / STUDIO',
  },
  { x: 360, y: 10, w: 140, h: 120, fill: '#f3f4f6', label: 'STORAGE' },
  { x: 10, y: 130, w: 150, h: 120, fill: '#fef9c3', label: 'RECEPTION' },
  { x: 160, y: 130, w: 200, h: 120, fill: '#ede9fe', label: 'MAIN HALL' },
  { x: 360, y: 130, w: 140, h: 230, fill: '#f3f4f6', label: 'TOILETS' },
  { x: 10, y: 250, w: 350, h: 110, fill: '#dcfce7', label: 'GALLERY' },
  { x: 10, y: 360, w: 490, h: 30, fill: '#e5e7eb', label: 'ENTRANCE ▲' },
]

function FloorPlanImage({
  hotspots,
  questionsById,
  answersById,
  onAnswerChange,
  onBlur,
}: {
  hotspots: DiagramHotspot[]
  questionsById: Record<string, SectionQuestion>
  answersById: Record<string, string>
  onAnswerChange: (qid: string, val: string) => void
  onBlur: (qid: string, val: string) => void
}) {
  const vw = 510,
    vh = 400
  return (
    <div>
      <div className="border rounded-lg overflow-hidden bg-white">
        <svg
          viewBox={`0 0 ${vw} ${vh}`}
          className="w-full"
          style={{ maxHeight: 260 }}
        >
          {FLOOR_PLAN_ROOMS.map((r, i) => (
            <g key={i}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill={r.fill}
                stroke="#9ca3af"
                strokeWidth="1.5"
              />
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8.5"
                fill="#374151"
                fontWeight="600"
                fontFamily="sans-serif"
              >
                {r.label}
              </text>
            </g>
          ))}
          {hotspots.map(h => {
            const cx = (h.x / 100) * vw
            const cy = (h.y / 100) * vh
            const answered = !!answersById[h.questionId]
            return (
              <g key={h.questionId}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="13"
                  fill={answered ? '#3b82f6' : '#f59e0b'}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fill="white"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {h.markerLabel ?? questionsById[h.questionId]?.order}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
        {hotspots.map(h => {
          const q = questionsById[h.questionId]
          const opts = ((q?.config as Record<string, unknown>)?.options ??
            []) as string[]
          return (
            <div
              key={h.questionId}
              className="flex items-center gap-1.5"
              id={`q-${h.questionId}`}
            >
              <span className="text-xs font-bold text-blue-600 shrink-0">
                {q?.order}.
              </span>
              <select
                value={answersById[h.questionId] ?? ''}
                onChange={e => onAnswerChange(h.questionId, e.target.value)}
                onBlur={e => onBlur(h.questionId, e.target.value)}
                className="flex-1 text-xs border border-gray-300 rounded px-1.5 py-1 focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="">—</option>
                {opts.map(o => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Question block input ─────────────────────────────────────────────────────

function QuestionBlockInput({
  questionId,
  groupType,
  questionsById,
  answersById,
  onAnswerChange,
  onBlur,
}: {
  questionId: string
  groupType: QuestionType
  questionsById: Record<string, SectionQuestion>
  answersById: Record<string, string>
  onAnswerChange: (qid: string, val: string) => void
  onBlur: (qid: string, val: string) => void
}) {
  const q = questionsById[questionId]
  const value = answersById[questionId] ?? ''
  const config = (q?.config ?? {}) as Record<string, unknown>
  const opts = (config.options ?? []) as { label: string; text: string }[]
  // const letters = ['A', 'B', 'C', 'D', 'E']
  console.log('BLookljk', opts)
  if (groupType === 'MULTIPLE_CHOICE') {
    console.log('groupType', 'MULTIPLE_CHOICE')
    return (
      <div className="space-y-1.5 mt-2 ml-2">
        {opts.map((opt, i) => {
          const letter = opt.label
          const selected = value === letter
          return (
            <label
              key={i}
              className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer border transition-colors ${selected ? 'bg-blue-50 border-blue-300' : 'border-transparent hover:bg-gray-50'}`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-500'}`}
              >
                {letter}
              </div>
              <span className="text-sm text-gray-800">{opt.text}</span>
              <input
                type="radio"
                className="sr-only"
                value={letter}
                checked={selected}
                onChange={() => onAnswerChange(questionId, letter)}
                onBlur={() => onBlur(questionId, letter)}
              />
            </label>
          )
        })}
      </div>
    )
  }

  if (groupType === 'MULTIPLE_CHOICE_MULTI_ANSWER') {
    console.log(
      'MULTIPLE_CHOICE_MULTIe_ANSWERMULTIPLE_CHOICE_MULTI_ANSWER',
      groupType,
    )
    const required = (config.requiredCount as number) ?? 2
    const selected = value ? value.split(',').filter(Boolean) : []
    const toggle = (letter: string) => {
      if (selected.includes(letter)) {
        onAnswerChange(questionId, selected.filter(l => l !== letter).join(','))
      } else {
        const next = [...selected, letter]
        if (next.length > required) next.shift()
        onAnswerChange(questionId, next.join(','))
      }
    }
    return (
      <div className="space-y-1.5 mt-2 ml-2">
        <p className="text-xs text-gray-400">
          Select {required} ({selected.length}/{required} chosen)
        </p>
        {opts.map((opt, i) => {
          const letter = opt.label
          const isSelected = selected.includes(letter)
          console.log('Option:', opt, 'Selected:', isSelected)
          return (
            <label
              key={i}
              className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer border transition-colors ${isSelected ? 'bg-blue-50 border-blue-300' : 'border-transparent hover:bg-gray-50'}`}
            >
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-500'}`}
              >
                {isSelected ? '✓' : letter}
              </div>
              <span className="text-sm text-gray-800">{opt.text}</span>
              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={() => toggle(letter)}
              />
            </label>
          )
        })}
      </div>
    )
  }

  if (
    groupType === 'MATCHING_FEATURES' ||
    groupType === 'MATCHING_HEADING' ||
    groupType === 'MATCHING_INFORMATION' ||
    groupType === 'MATCHING_SENTENCE_ENDINGS' ||
    groupType === 'DIAGRAM_LABELLING'
  ) {
    return (
      <select
        value={value}
        onChange={e => onAnswerChange(questionId, e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400 bg-white"
      >
        <option value="">—</option>
        {(opts as unknown as string[]).map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    )
  }

  // FORM_COMPLETION, SHORT_ANSWER, NOTE_COMPLETION, TABLE_COMPLETION, SENTENCE_COMPLETION, etc.
  return (
    <input
      type="text"
      value={value}
      onChange={e => onAnswerChange(questionId, e.target.value)}
      onBlur={e => onBlur(questionId, e.target.value)}
      className="border-b-2 border-blue-400 bg-transparent focus:outline-none w-36 text-sm px-1 py-0.5"
      placeholder="..."
    />
  )
}

// ─── Question block wrapper ───────────────────────────────────────────────────

function QuestionBlock({
  block,
  groupType,
  questionsById,
  answersById,
  onAnswerChange,
  onBlur,
}: {
  block: Extract<ContentBlock, { kind: 'question' }>
  groupType: QuestionType
  questionsById: Record<string, SectionQuestion>
  answersById: Record<string, string>
  onAnswerChange: (qid: string, val: string) => void
  onBlur: (qid: string, val: string) => void
}) {
  const q = questionsById[block.questionId]
  console.log('QuestionBlock', {
    block,
    groupType,
    q,
    questionsById,
    answersById,
  })
  if (!q) return null

  const cfg = (q.config ?? {}) as Record<string, unknown>
  const displayNum = (cfg.displayRange as string | undefined) ?? String(q.order)
  const answered = !!answersById[block.questionId]
  const badgeCls = answered
    ? 'bg-green-500 text-white'
    : 'bg-blue-100 text-blue-700'

  // FORM_COMPLETION: label on left, input inline
  if (groupType === 'FORM_COMPLETION') {
    return (
      <div
        id={`q-${block.questionId}`}
        className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
      >
        <span
          className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${badgeCls}`}
        >
          {q.order}
        </span>
        <span className="text-sm text-gray-600 w-44 shrink-0">
          {block.label ?? q.prompt}
        </span>
        <QuestionBlockInput
          questionId={block.questionId}
          groupType={groupType}
          questionsById={questionsById}
          answersById={answersById}
          onAnswerChange={onAnswerChange}
          onBlur={onBlur}
        />
      </div>
    )
  }

  // MATCHING_*: prompt on left, select on right in one row
  if (
    groupType === 'MATCHING_FEATURES' ||
    groupType === 'MATCHING_HEADING' ||
    groupType === 'MATCHING_INFORMATION' ||
    groupType === 'MATCHING_SENTENCE_ENDINGS'
  ) {
    return (
      <div
        id={`q-${block.questionId}`}
        className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
      >
        <span
          className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${badgeCls}`}
        >
          {q.order}
        </span>
        <span className="text-sm text-gray-700 flex-1">
          {q.prompt ?? block.label}
        </span>
        <QuestionBlockInput
          questionId={block.questionId}
          groupType={groupType}
          questionsById={questionsById}
          answersById={answersById}
          onAnswerChange={onAnswerChange}
          onBlur={onBlur}
        />
      </div>
    )
  }

  // SHORT_ANSWER: number badge + prompt, then input below
  if (groupType === 'SHORT_ANSWER') {
    return (
      <div
        id={`q-${block.questionId}`}
        className="space-y-2 py-2 border-b border-gray-100 last:border-0"
      >
        <div className="flex items-start gap-2">
          <span
            className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${badgeCls}`}
          >
            {q.order}
          </span>
          <p className="text-sm text-gray-800">{q.prompt ?? block.label}</p>
        </div>
        <div className="ml-6">
          <QuestionBlockInput
            questionId={block.questionId}
            groupType={groupType}
            questionsById={questionsById}
            answersById={answersById}
            onAnswerChange={onAnswerChange}
            onBlur={onBlur}
          />
        </div>
      </div>
    )
  }

  // MULTIPLE_CHOICE / MULTIPLE_CHOICE_MULTI_ANSWER: card with prompt + options
  console.log('groupeTypegroupTypegroupType', groupType, q)
  return (
    <div
      id={`q-${block.questionId}`}
      className={`p-4 border-2 rounded-xl transition-colors ${answered ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-white'}`}
    >
      <div className="flex items-start gap-2 mb-1">
        <span
          className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${badgeCls}`}
        >
          {displayNum}
        </span>
        <p className="text-sm font-medium text-gray-800 leading-snug">
          {q.prompt ?? block.label}
        </p>
      </div>
      <QuestionBlockInput
        questionId={block.questionId}
        groupType={groupType}
        questionsById={questionsById}
        answersById={answersById}
        onAnswerChange={onAnswerChange}
        onBlur={onBlur}
      />
    </div>
  )
}

function FlowChart({
  block,
  questionsById,
  answersById,
  onAnswerChange,
  onBlur,
}: {
  block: Extract<ContentBlock, { kind: 'flow-chart' }>
  questionsById: Record<string, SectionQuestion>
  answersById: Record<string, string>
  onAnswerChange: (qid: string, val: string) => void
  onBlur: (qid: string, val: string) => void
}) {
  return (
    <div className="flex flex-col items-center gap-0">
      {block.nodes.map((node, i) => (
        <Fragment key={i}>
          <div
            className="
              w-full max-w-xl
              rounded-lg
              border border-gray-300
              bg-white
              px-5 py-4
              text-sm text-gray-800
              shadow-sm
            "
          >
            {node.map((inlineNode, ni) =>
              renderInlineNode(
                inlineNode,
                ni,
                'FLOW_CHART_COMPLETION',
                questionsById,
                answersById,
                onAnswerChange,
                onBlur,
              ),
            )}
          </div>

          {i < block.nodes.length - 1 && (
            <div className="flex flex-col items-center">
              <div className="h-5 w-px bg-gray-400" />
              <div className="text-gray-400 text-sm leading-none">▼</div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  )
}

// ─── Main renderer ────────────────────────────────────────────────────────────

export function ContentBlockRenderer({
  blocks,
  groupType,
  questionsById,
  answersById,
  onAnswerChange,
  onBlur,
}: ContentBlockRendererProps) {
  console.log('ContentBlockRenderer', {
    blocks,
    groupType,
    questionsById,
    answersById,
  })
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'heading':
            return (
              <h2
                key={i}
                className="text-sm font-bold text-gray-900 text-center tracking-wide py-1"
              >
                {block.text}
              </h2>
            )

          case 'subheading':
            return (
              <h3
                key={i}
                className="text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 pb-1 mt-4 first:mt-0"
              >
                {block.text}
              </h3>
            )

          case 'instruction':
            return (
              <p key={i} className="text-xs text-gray-500 italic">
                {block.text}
              </p>
            )

          case 'paragraph':
            return (
              <p key={i} className="text-sm text-gray-800 leading-relaxed">
                {block.label && (
                  <span className="font-semibold text-gray-600 mr-2">
                    [{block.label}]
                  </span>
                )}
                {block.content.map((node, ni) =>
                  renderInlineNode(
                    node,
                    ni,
                    groupType,
                    questionsById,
                    answersById,
                    onAnswerChange,
                    onBlur,
                  ),
                )}
              </p>
            )

          case 'question':
            return (
              <QuestionBlock
                key={i}
                block={block}
                groupType={groupType}
                questionsById={questionsById}
                answersById={answersById}
                onAnswerChange={onAnswerChange}
                onBlur={onBlur}
              />
            )

          case 'list':
            return (
              <ul key={i} className="space-y-1.5 text-sm text-gray-800">
                {block.items.map((item, ii) => (
                  <li key={ii} className="flex items-baseline gap-2">
                    {!block.ordered && (
                      <span className="text-gray-300 shrink-0">•</span>
                    )}
                    <span>
                      {item.map((node, ni) =>
                        renderInlineNode(
                          node,
                          ni,
                          groupType,
                          questionsById,
                          answersById,
                          onAnswerChange,
                          onBlur,
                        ),
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )

          case 'table':
            return (
              <div key={i} className="overflow-x-auto">
                {block.caption && (
                  <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
                    {block.caption}
                  </p>
                )}
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {block.columns.map((col, ci) => (
                        <th
                          key={ci}
                          className="border border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className="even:bg-gray-50/50">
                        {row.map((cell, ci) => (
                          <TableCell
                            key={ci}
                            cell={cell}
                            groupType={groupType}
                            questionsById={questionsById}
                            answersById={answersById}
                            onAnswerChange={onAnswerChange}
                            onBlur={onBlur}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          case 'image':
            if (block.url === 'internal:community-arts-centre-floor-plan') {
              return (
                <FloorPlanImage
                  key={i}
                  hotspots={block.hotspots ?? []}
                  questionsById={questionsById}
                  answersById={answersById}
                  onAnswerChange={onAnswerChange}
                  onBlur={onBlur}
                />
              )
            }
            return (
              <div
                key={i}
                className="bg-gray-100 rounded-lg p-8 text-center text-gray-400 text-xs border border-dashed"
              >
                {block.alt ?? block.url}
              </div>
            )

          case 'divider':
            return <hr key={i} className="border-gray-200" />

          case 'flow-chart':
            return (
              <FlowChart
                key={i}
                block={block}
                questionsById={questionsById}
                answersById={answersById}
                onAnswerChange={onAnswerChange}
                onBlur={onBlur}
              />
            )

          default:
            return null
        }
      })}
    </div>
  )
}
