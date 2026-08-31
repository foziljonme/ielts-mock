import React from 'react'
import { ListeningQuestionGroup, Question, MapRoomConfig } from './types'
import { Map } from 'lucide-react'

interface Props {
  group: ListeningQuestionGroup
  questions: Question[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, value: string) => void
  globalStartNumber: number
}

const SVG_W = 520
const SVG_H = 400

function RoomRect({
  room,
  qNum,
  answered,
  selectedLetter,
}: {
  room: MapRoomConfig
  qNum?: number
  answered: boolean
  selectedLetter?: string
}) {
  const cx = room.x + room.w / 2
  const cy = room.y + room.h / 2

  if (room.fixedLabel) {
    return (
      <g>
        <rect
          x={room.x}
          y={room.y}
          width={room.w}
          height={room.h}
          fill={room.fill}
          stroke={room.stroke ?? '#9ca3af'}
          strokeWidth="1.5"
        />
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize="11"
          fill="#6b7280"
          fontWeight="600"
          letterSpacing="1"
        >
          {room.fixedLabel}
        </text>
      </g>
    )
  }

  // Question room
  const markerFill = answered ? '#22c55e' : '#3b82f6'

  return (
    <g>
      <rect
        x={room.x}
        y={room.y}
        width={room.w}
        height={room.h}
        fill={room.fill}
        stroke={room.stroke ?? '#94a3b8'}
        strokeWidth="2"
        rx="3"
      />
      {/* Selected letter label (large, faint) */}
      {selectedLetter && (
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fontSize="28"
          fill={answered ? '#16a34a' : '#1d4ed8'}
          opacity="0.25"
          fontWeight="800"
        >
          {selectedLetter}
        </text>
      )}
      {/* Question number marker */}
      <circle cx={cx} cy={cy} r={16} fill={markerFill} />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontSize="12"
        fill="white"
        fontWeight="700"
      >
        {qNum}
      </text>
      {/* Answered: show letter badge */}
      {selectedLetter && (
        <g>
          <circle
            cx={room.x + room.w - 14}
            cy={room.y + 14}
            r={11}
            fill="white"
            stroke={markerFill}
            strokeWidth="2"
          />
          <text
            x={room.x + room.w - 14}
            y={room.y + 19}
            textAnchor="middle"
            fontSize="11"
            fill={markerFill}
            fontWeight="800"
          >
            {selectedLetter}
          </text>
        </g>
      )}
    </g>
  )
}

export function MapLabellingQuestion({
  group,
  questions,
  answers,
  onAnswerChange,
  globalStartNumber,
}: Props) {
  const rooms: MapRoomConfig[] = group.mapRooms ?? []
  const options = group.mapOptions ?? []

  // Build question → number mapping
  const qNumMap: Record<string, number> = {}
  questions.forEach((q, i) => {
    qNumMap[q.id] = globalStartNumber + i
  })

  return (
    <div className="space-y-5">
      {/* SVG floor plan */}
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
        <div className="bg-gray-700 text-white px-4 py-2 flex items-center gap-2">
          <Map className="w-4 h-4 opacity-70" />
          <span className="text-sm font-semibold">
            {group.mapTitle ?? 'Floor Plan'}
          </span>
          <span className="ml-auto text-xs opacity-60">North ↑</span>
        </div>

        <div className="p-3">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full"
            style={{ maxHeight: '280px' }}
          >
            {/* Outer building */}
            <rect
              x="10"
              y="10"
              width="500"
              height="380"
              fill="none"
              stroke="#374151"
              strokeWidth="3"
            />
            {/* Compass rose */}
            <text
              x="488"
              y="25"
              fontSize="11"
              fill="#9ca3af"
              textAnchor="middle"
            >
              N
            </text>
            <line
              x1="488"
              y1="28"
              x2="488"
              y2="42"
              stroke="#9ca3af"
              strokeWidth="1.5"
            />

            {/* Render each room */}
            {rooms.map((room, i) => {
              const q = questions.find(q => q.id === room.questionId)
              const answered = q ? !!answers[q.id] : false
              const selectedLetter = q ? answers[q.id] : undefined
              return (
                <RoomRect
                  key={i}
                  room={room}
                  qNum={room.qNum}
                  answered={answered}
                  selectedLetter={selectedLetter}
                />
              )
            })}
          </svg>
        </div>
      </div>

      {/* Options word box */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
          Options
        </p>
        <div className="flex flex-wrap gap-3">
          {options.map((opt: any) => (
            <div
              key={opt.id}
              className="flex items-center gap-1.5 text-sm text-gray-700"
            >
              <span className="font-bold text-gray-900">{opt.id}</span>
              <span className="text-gray-400">–</span>
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Answer inputs for each question position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {questions.map((q, i) => {
          const num = qNumMap[q.id]
          const answered = !!answers[q.id]
          return (
            <div
              key={q.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                answered
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  answered
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {num}
              </div>
              <span className="text-xs text-gray-500 shrink-0">
                Write letter:
              </span>
              <select
                value={answers[q.id] || ''}
                onChange={e => onAnswerChange(q.id, e.target.value)}
                className={`flex-1 text-sm font-semibold border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent rounded-none focus:ring-0 uppercase ${
                  answered
                    ? 'border-green-400 text-green-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                <option value="">—</option>
                {options.map((opt: any) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.id} – {opt.label}
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
