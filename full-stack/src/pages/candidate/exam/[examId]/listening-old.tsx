import React, { useState, useEffect, useRef, useMemo } from 'react'
// import { listeningParts } from '../data/mockData'
import {
  ListeningQuestionGroup,
  ListeningPart,
  Question,
} from '../../components/types'

// Question-type components
import { FormCompletionQuestion } from '../../components/FormCompletionQuestion'
import { MapLabellingQuestion } from '../../components/MapLabellingQuestion'
import { MatchingQuestion } from '../../components/MatchingQuestion'
import { MultipleChoiceQuestion } from '../../components/MultipleChoiceQuestion'
import { MultipleChoiceMultiQuestion } from '../../components/MultipleChoiceMultiQuestion'
import { NoteTableCompletionQuestion } from '../../components/NoteTableCompletionQuestion'
import { ShortAnswerQuestion } from '../../components/ShortAnswerQuestion'

import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Headphones,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { TestTimer } from '../../components/TestTimer'
import { Button } from '@/components/button'
import useExamStore from '@/stores/exam.store'
import {
  IQuestion,
  IQuestionGroup,
  IQuestionGroupWithQuestions,
} from '@/types/exams'

interface ListeningSectionProps {
  onComplete: (answers: Record<string, string>) => void
  onTimeUp: () => void
}

// ── Type-label display map ────────────────────────────────────────────────────
const GROUP_TYPE_LABELS: Record<string, string> = {
  FORM_COMPLETION: 'Form Completion',
  'map-labelling': 'Plan / Map Labelling',
  matching: 'Matching',
  MULTIPLE_CHOICE: 'Multiple Choice',
  'multiple-choice-multi': 'Multiple Choice (Choose TWO)',
  'note-completion': 'Note Completion',
  'table-completion': 'Table Completion',
  'short-answer': 'Short Answer',
}

const GROUP_TYPE_COLORS: Record<string, string> = {
  'form-completion': 'bg-blue-100 text-blue-700',
  'map-labelling': 'bg-purple-100 text-purple-700',
  matching: 'bg-indigo-100 text-indigo-700',
  'multiple-choice': 'bg-green-100 text-green-700',
  'multiple-choice-multi': 'bg-teal-100 text-teal-700',
  'note-completion': 'bg-amber-100 text-amber-700',
  'table-completion': 'bg-orange-100 text-orange-700',
  'short-answer': 'bg-rose-100 text-rose-700',
}

export const mockListeningSection: any = {
  id: 'listening-1',
  name: 'IELTS Listening',
  duration: 30,
  audioUrl: 'mock-audio.mp3',
  questions: [
    // ── Part 1 · Form / Note Completion (Q1–10) ──────────────────────────────
    // Sports centre membership enquiry
    {
      id: 'l1',
      type: 'form-completion',
      question: 'Surname',
      correctAnswer: 'Mercer',
      wordLimit: 1,
    },
    {
      id: 'l2',
      type: 'form-completion',
      question: 'Address',
      correctAnswer: 'Birchwood',
      wordLimit: 1,
    },
    {
      id: 'l3',
      type: 'form-completion',
      question: 'Postcode',
      correctAnswer: 'BN3 4QT',
      wordLimit: 2,
    },
    {
      id: 'l4',
      type: 'form-completion',
      question: 'Contact number',
      correctAnswer: '07712 334 881',
      wordLimit: 3,
    },
    {
      id: 'l5',
      type: 'form-completion',
      question: 'Email',
      correctAnswer: 'j.mercer',
      wordLimit: 1,
    },
    {
      id: 'l6',
      type: 'form-completion',
      question: 'Membership type',
      correctAnswer: 'annual',
      wordLimit: 1,
    },
    {
      id: 'l7',
      type: 'form-completion',
      question: 'Start date',
      correctAnswer: '1st October',
      wordLimit: 2,
    },
    {
      id: 'l8',
      type: 'form-completion',
      question: 'Facilities of interest',
      correctAnswer: 'swimming pool',
      wordLimit: 2,
    },
    {
      id: 'l9',
      type: 'form-completion',
      question: 'Medical condition noted',
      correctAnswer: 'asthma',
      wordLimit: 1,
    },
    {
      id: 'l10',
      type: 'form-completion',
      question: 'Payment method',
      correctAnswer: 'direct debit',
      wordLimit: 2,
    },

    // ── Part 2 · Map / Plan Labelling (Q11–15) + Multiple Choice (Q16–20) ───
    // Community Arts Centre floor plan
    {
      id: 'l11',
      type: 'map-labelling',
      question: 'Label the position marked 11 on the plan.',
      correctAnswer: 'D',
    },
    {
      id: 'l12',
      type: 'map-labelling',
      question: 'Label the position marked 12 on the plan.',
      correctAnswer: 'B',
    },
    {
      id: 'l13',
      type: 'map-labelling',
      question: 'Label the position marked 13 on the plan.',
      correctAnswer: 'C',
    },
    {
      id: 'l14',
      type: 'map-labelling',
      question: 'Label the position marked 14 on the plan.',
      correctAnswer: 'A',
    },
    {
      id: 'l15',
      type: 'map-labelling',
      question: 'Label the position marked 15 on the plan.',
      correctAnswer: 'G',
    },
    // Heritage walk – multiple choice
    {
      id: 'l16',
      type: 'multiple-choice',
      question: 'At what time does the heritage walk depart?',
      options: ['9 am', '10 am', '11 am'],
      correctAnswer: '10 am',
    },
    {
      id: 'l17',
      type: 'multiple-choice',
      question: 'How long does the walk last?',
      options: ['One hour', 'One and a half hours', 'Two hours'],
      correctAnswer: 'Two hours',
    },
    {
      id: 'l18',
      type: 'multiple-choice',
      question: 'What must participants bring?',
      options: [
        'Waterproof clothing',
        'Comfortable footwear',
        'A packed lunch',
      ],
      correctAnswer: 'Waterproof clothing',
    },
    {
      id: 'l19',
      type: 'multiple-choice',
      question: 'In what year was the old town hall constructed?',
      options: ['1856', '1874', '1892'],
      correctAnswer: '1874',
    },
    {
      id: 'l20',
      type: 'multiple-choice',
      question: 'What is the cost of the audio commentary guide?',
      options: ['£2.50', '£3.00', 'Free of charge'],
      correctAnswer: 'Free of charge',
    },

    // ── Part 3 · Matching (Q21–25) + Multiple Choice incl. Multi (Q26–30) ───
    // Academic project discussion – match tasks to people
    {
      id: 'l21',
      type: 'matching',
      question: 'Writing the literature review',
      correctAnswer: 'A',
    },
    {
      id: 'l22',
      type: 'matching',
      question: 'Designing the questionnaire',
      correctAnswer: 'C',
    },
    {
      id: 'l23',
      type: 'matching',
      question: 'Analysing the quantitative data',
      correctAnswer: 'B',
    },
    {
      id: 'l24',
      type: 'matching',
      question: 'Booking the interview rooms',
      correctAnswer: 'D',
    },
    {
      id: 'l25',
      type: 'matching',
      question: 'Proofreading the final report',
      correctAnswer: 'A',
    },
    // Choose TWO – spans questions 26 and 27
    {
      id: 'l26',
      type: 'multiple-choice-multi',
      question:
        'Questions 26 and 27\nWhich TWO problems with their project do the students mention?',
      options: [
        'Difficulty recruiting participants',
        'Unclear research question',
        'Deadline too tight',
        'Limited access to databases',
        'Disagreement on methodology',
      ],
      correctAnswers: ['A', 'C'],
      requiredAnswerCount: 2,
      correctAnswer: 'A,C',
    },
    // Single MC (Q28–30)
    {
      id: 'l28',
      type: 'multiple-choice',
      question: 'What does the tutor advise them to do first?',
      options: [
        'Revise the research question',
        'Complete the online survey',
        'Meet the interviewees',
      ],
      correctAnswer: 'Complete the online survey',
    },
    {
      id: 'l29',
      type: 'multiple-choice',
      question:
        'How often should they meet with their tutor during the project?',
      options: ['Once a week', 'Every two weeks', 'Once a month'],
      correctAnswer: 'Once a week',
    },
    {
      id: 'l30',
      type: 'multiple-choice',
      question: 'What is the final word limit for their report?',
      options: ['5,000 words', '7,500 words', '10,000 words'],
      correctAnswer: '7,500 words',
    },

    // ── Part 4 · Table Completion (Q31–35) + Note Completion (Q36–37) + Short Answer (Q38–40) ──
    // Academic lecture on urban farming
    {
      id: 'l31',
      type: 'table-completion',
      question: 'Hydroponics – Key Benefit: _______ soil needed',
      correctAnswer: 'no',
      wordLimit: 1,
    },
    {
      id: 'l32',
      type: 'table-completion',
      question: 'Vertical farming – Key Benefit: Space _______',
      correctAnswer: 'efficient',
      wordLimit: 1,
    },
    {
      id: 'l33',
      type: 'table-completion',
      question: 'Rooftop gardens – Main Challenge: Structural _______',
      correctAnswer: 'loading',
      wordLimit: 1,
    },
    {
      id: 'l34',
      type: 'table-completion',
      question: 'Aquaponics – Main Challenge: System _______',
      correctAnswer: 'complexity',
      wordLimit: 1,
    },
    {
      id: 'l35',
      type: 'table-completion',
      question: 'Microgreens – Key Benefit: Fast _______',
      correctAnswer: 'growth',
      wordLimit: 1,
    },
    {
      id: 'l36',
      type: 'note-completion',
      question:
        'Urban agriculture can use up to _______ less water than conventional methods.',
      correctAnswer: '90%',
      wordLimit: 1,
    },
    {
      id: 'l37',
      type: 'note-completion',
      question:
        'By 2050, approximately _______% of the global population will live in cities.',
      correctAnswer: '68',
      wordLimit: 1,
    },
    {
      id: 'l38',
      type: 'short-answer',
      question:
        'What type of fish is most commonly raised in aquaponics systems?',
      correctAnswer: 'tilapia',
      wordLimit: 1,
    },
    {
      id: 'l39',
      type: 'short-answer',
      question:
        'Which city does the lecturer identify as a global leader in urban farming?',
      correctAnswer: 'Singapore',
      wordLimit: 1,
    },
    {
      id: 'l40',
      type: 'short-answer',
      question:
        'According to the lecturer, what is the single biggest barrier to urban farming expansion?',
      correctAnswer: 'high initial costs',
      wordLimit: 3,
    },
  ],
}

// ─── Community Arts Centre floor plan rooms (shared map geometry for Part 2) ─
export const communityArtsCentreRooms = [
  // Question rooms (positioned by question number)
  {
    x: 10,
    y: 130,
    w: 150,
    h: 120,
    fill: '#fef9c3',
    stroke: '#ca8a04',
    questionId: 'l11',
    qNum: 11,
  }, // Reception area
  {
    x: 10,
    y: 250,
    w: 350,
    h: 110,
    fill: '#dcfce7',
    stroke: '#16a34a',
    questionId: 'l12',
    qNum: 12,
  }, // Gallery (large, bottom)
  {
    x: 160,
    y: 130,
    w: 200,
    h: 120,
    fill: '#ede9fe',
    stroke: '#7c3aed',
    questionId: 'l13',
    qNum: 13,
  }, // Main Hall
  {
    x: 10,
    y: 10,
    w: 150,
    h: 120,
    fill: '#fce7f3',
    stroke: '#be185d',
    questionId: 'l14',
    qNum: 14,
  }, // Café (top left)
  {
    x: 160,
    y: 10,
    w: 200,
    h: 120,
    fill: '#e0f2fe',
    stroke: '#0284c7',
    questionId: 'l15',
    qNum: 15,
  }, // Workshop/Studio (top)
  // Pre-labelled rooms
  {
    x: 360,
    y: 10,
    w: 150,
    h: 120,
    fill: '#f3f4f6',
    stroke: '#9ca3af',
    fixedLabel: 'STORAGE',
  },
  {
    x: 360,
    y: 130,
    w: 150,
    h: 230,
    fill: '#f3f4f6',
    stroke: '#9ca3af',
    fixedLabel: 'TOILETS',
  },
  {
    x: 10,
    y: 360,
    w: 500,
    h: 30,
    fill: '#e5e7eb',
    stroke: '#9ca3af',
    fixedLabel: 'ENTRANCE ▲',
  },
]

// ─── Listening parts with full group configs ───────────────────────────────────
export const listeningParts: ListeningPart[] = [
  // ── PART 1 ──────────────────────────────────────────────────────────────────
  {
    id: 'part-1',
    label: 'Part 1',
    description: 'Social dialogue – Sports centre membership enquiry',
    questionRange: [1, 10],
    questionIds: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10'],
    groups: [
      {
        type: 'form-completion',
        questionIds: [
          'l1',
          'l2',
          'l3',
          'l4',
          'l5',
          'l6',
          'l7',
          'l8',
          'l9',
          'l10',
        ],
        questionRange: [1, 10],
        instructions:
          'Complete the form below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        formTitle: 'HILLSIDE SPORTS CENTRE — MEMBERSHIP ENQUIRY FORM',
        formSections: [
          {
            heading: 'Personal Details',
            fields: [
              { label: 'Title and surname', questionId: 'l1', prefix: 'Mr' },
              {
                label: 'Address',
                questionId: 'l2',
                suffix: 'Avenue, Hillside',
              },
              { label: 'Postcode', questionId: 'l3' },
              { label: 'Contact number', questionId: 'l4' },
              {
                label: 'Email address',
                questionId: 'l5',
                suffix: '@citymail.com',
              },
            ],
          },
          {
            heading: 'Membership Details',
            fields: [
              { label: 'Type of membership', questionId: 'l6' },
              { label: 'Preferred start date', questionId: 'l7' },
              {
                label: 'Facilities of interest',
                questionId: 'l8',
                suffix: 'and the gym',
              },
            ],
          },
          {
            heading: 'Health & Payment',
            fields: [
              { label: 'Medical condition noted', questionId: 'l9' },
              { label: 'Preferred payment method', questionId: 'l10' },
            ],
          },
        ],
      },
    ],
  },

  // ── PART 2 ──────────────────────────────────────────────────────────────────
  {
    id: 'part-2',
    label: 'Part 2',
    description: 'Monologue – Community Arts Centre tour & heritage walk',
    questionRange: [11, 20],
    questionIds: [
      'l11',
      'l12',
      'l13',
      'l14',
      'l15',
      'l16',
      'l17',
      'l18',
      'l19',
      'l20',
    ],
    groups: [
      {
        type: 'map-labelling',
        questionIds: ['l11', 'l12', 'l13', 'l14', 'l15'],
        questionRange: [11, 15],
        instructions:
          'Label the plan below.\nWrite the correct letter, A–G, next to Questions 11–15.',
        mapTitle: 'Community Arts Centre — Ground Floor Plan',
        mapOptions: [
          { id: 'A', label: 'Café' },
          { id: 'B', label: 'Gallery' },
          { id: 'C', label: 'Main Hall' },
          { id: 'D', label: 'Reception' },
          { id: 'E', label: 'Recording Studio' },
          { id: 'F', label: 'Shop' },
          { id: 'G', label: 'Workshop' },
        ],
        mapRooms: communityArtsCentreRooms,
      },
      {
        type: 'multiple-choice',
        questionIds: ['l16', 'l17', 'l18', 'l19', 'l20'],
        questionRange: [16, 20],
        instructions: 'Choose the correct letter, A, B or C.',
      },
    ],
  },

  // ── PART 3 ──────────────────────────────────────────────────────────────────
  {
    id: 'part-3',
    label: 'Part 3',
    description: 'Academic discussion – Student research project',
    questionRange: [21, 30],
    questionIds: [
      'l21',
      'l22',
      'l23',
      'l24',
      'l25',
      'l26',
      'l28',
      'l29',
      'l30',
    ],
    groups: [
      {
        type: 'matching',
        questionIds: ['l21', 'l22', 'l23', 'l24', 'l25'],
        questionRange: [21, 25],
        instructions:
          'What does each student say about the following project tasks?\nChoose FIVE answers from the box and write the correct letter, A–D, next to Questions 21–25.',
        matchingPrompt: 'Match each task to the person responsible.',
        matchingOptions: [
          { id: 'A', label: 'Sarah only' },
          { id: 'B', label: 'James only' },
          { id: 'C', label: 'Both students' },
          { id: 'D', label: 'Neither student (tutor will arrange)' },
        ],
      },
      {
        type: 'multiple-choice-multi',
        questionIds: ['l26'],
        questionRange: [26, 27],
        instructions: 'Choose TWO letters, A–E.',
      },
      {
        type: 'multiple-choice',
        questionIds: ['l28', 'l29', 'l30'],
        questionRange: [28, 30],
        instructions: 'Choose the correct letter, A, B or C.',
      },
    ],
  },

  // ── PART 4 ──────────────────────────────────────────────────────────────────
  {
    id: 'part-4',
    label: 'Part 4',
    description: 'Academic lecture – Urban farming',
    questionRange: [31, 40],
    questionIds: [
      'l31',
      'l32',
      'l33',
      'l34',
      'l35',
      'l36',
      'l37',
      'l38',
      'l39',
      'l40',
    ],
    groups: [
      {
        type: 'table-completion',
        questionIds: ['l31', 'l32', 'l33', 'l34', 'l35'],
        questionRange: [31, 35],
        instructions:
          'Complete the table below.\nWrite ONE WORD ONLY for each answer.',
        tableTitle: 'Urban Farming Techniques',
        tableHeaders: ['Technique', 'Key Benefit', 'Main Challenge'],
        tableRows: [
          [
            { text: 'Hydroponics' },
            { questionId: 'l31', prefix: '', suffix: ' soil needed' },
            { text: 'High setup costs' },
          ],
          [
            { text: 'Vertical farming' },
            { questionId: 'l32', prefix: 'Space ', suffix: '' },
            { text: 'High energy use' },
          ],
          [
            { text: 'Rooftop gardens' },
            { text: 'Improved insulation' },
            { questionId: 'l33', prefix: 'Structural ', suffix: '' },
          ],
          [
            { text: 'Aquaponics' },
            { text: 'Combines fish + plants' },
            { questionId: 'l34', prefix: 'System ', suffix: '' },
          ],
          [
            { text: 'Microgreens' },
            { questionId: 'l35', prefix: 'Fast ', suffix: '' },
            { text: 'Short shelf life' },
          ],
        ],
      },
      {
        type: 'note-completion',
        questionIds: ['l36', 'l37'],
        questionRange: [36, 37],
        instructions:
          'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
        noteTitle: 'Key Statistics — Urban Farming Lecture',
        noteBlocks: [
          {
            items: [
              {
                prefix: 'Urban agriculture can use up to ',
                questionId: 'l36',
                suffix: ' less water than conventional farming',
              },
              {
                prefix: 'By 2050, approximately ',
                questionId: 'l37',
                suffix: "% of the world's population will live in cities",
              },
            ],
          },
        ],
      },
      {
        type: 'short-answer',
        questionIds: ['l38', 'l39', 'l40'],
        questionRange: [38, 40],
        instructions:
          'Answer the questions below.\nWrite NO MORE THAN THREE WORDS for each answer.',
      },
    ],
  },
]

// ── Question group renderer ───────────────────────────────────────────────────
function QuestionGroupRenderer({
  group,
  allQuestions,
  answers,
  onAnswerChange,
}: {
  group: QuestionGroupTemplate
  allQuestions: IQuestion[]
  answers: Record<string, string>
  onAnswerChange: (id: string, val: string) => void
}) {
  const questions = allQuestions.filter(q => group.questionIds.includes(q.id))
  const globalStart = group.questionRange[0]

  const sharedProps = {
    group,
    questions,
    answers,
    onAnswerChange,
    globalStartNumber: globalStart,
  }

  switch (group.type) {
    case 'FORM_COMPLETION':
      console.log('QuestionGroupRenderer: note comlation', group)
      return <FormCompletionQuestion {...sharedProps} />
    case 'DIAGRAM_LABELLING':
      console.log('QuestionGroupRenderer: Diagram')
      return <MapLabellingQuestion {...sharedProps} />
    // case 'matching':
    //   return <MatchingQuestion {...sharedProps} />
    case 'MULTIPLE_CHOICE':
      console.log('QuestionGroupRenderer: mulktiple question', group)

      return (
        <MultipleChoiceQuestion
          questions={questions}
          answers={answers}
          onAnswerChange={onAnswerChange}
          globalStartNumber={globalStart}
        />
      )
    case 'MULTIPLE_CHOICE_MULTI_ANSWER':
      console.log('QuestionGroupRenderer: mulktiple question multi')

      return (
        <MultipleChoiceMultiQuestion
          group={group as any}
          questions={questions}
          answers={answers}
          onAnswerChange={onAnswerChange}
          globalStartNumber={globalStart}
        />
      )
    case 'TABLE_COMPLETION':
      // case 'NOTE_COMPLETION':
      console.log('QuestionGroupRenderer: mulktiple question multi')
      return <NoteTableCompletionQuestion {...sharedProps} />
    case 'SHORT_ANSWER':
      return (
        <ShortAnswerQuestion
          questions={questions}
          answers={answers}
          onAnswerChange={onAnswerChange}
          globalStartNumber={globalStart}
        />
      )
    default:
      return null
  }
}

export type QuestionGroupTemplate = {
  questionIds: string[]
  questionRange: number[]
} & IQuestionGroupWithQuestions

type QuestionPartType = {
  groups: QuestionGroupTemplate[]
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ListeningSection({
  onComplete,
  onTimeUp,
}: ListeningSectionProps) {
  const { activeSection, fetchCurrentSection } = useExamStore()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [audioEnded, setAudioEnded] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  console.log('activeSection', activeSection)
  const groupBySections = useMemo(() => {
    if (!activeSection) return []
    const sections: QuestionPartType[] = []
    let currSectionQuestionGroups: QuestionGroupTemplate[] = []
    let count = 0
    const questionGroupsSorted = activeSection?.questionGroups.sort(
      (a, b) => a.order - b.order,
    )
    for (const group of questionGroupsSorted) {
      count += group.questions.length
      const questionIds = group.questions.map(q => q.id)
      const questionRange = [
        group.questions[0].order,
        group.questions[questionIds.length - 1].order,
      ]
      currSectionQuestionGroups.push({
        ...group,
        questionIds,
        questionRange,
      })

      if (count % 10 === 0) {
        sections.push({
          groups: currSectionQuestionGroups,
        })
        currSectionQuestionGroups = []
      }
    }

    return sections
  }, [activeSection])
  // const part = activeSection.
  console.log('groupBySections', groupBySections)
  const currentPart: QuestionPartType = groupBySections[currentPartIndex]
  console.log('currentPart', currentPart)
  const allQuestions = mockListeningSection.questions
  console.log('allQuestions', allQuestions)
  const answeredCount = Object.keys(answers).filter(k => answers[k]).length
  // 39 actual question IDs (Q26-27 is one multi-select entry covering 2 display numbers)
  const totalQuestions = listeningParts.reduce(
    (sum: number, p: any) => sum + p.questionIds.length,
    0,
  )

  useEffect(() => {
    if (!activeSection) {
      fetchCurrentSection()
    }
  }, [activeSection, fetchCurrentSection])

  // Simulate audio progress
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            setAudioEnded(e => {
              const n = [...e]
              n[currentPartIndex] = true
              return n
            })
            if (intervalRef.current) clearInterval(intervalRef.current)
            return 100
          }
          return prev + 0.35
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, currentPartIndex])

  const handlePartChange = (index: number) => {
    setIsPlaying(false)
    setAudioProgress(0)
    setCurrentPartIndex(index)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => onComplete(answers)
  const handleTimeUp = () => {
    onTimeUp()
    handleSubmit()
  }

  const formatTime = (pct: number) => {
    const total = 285 // ~4:45 per part
    const secs = Math.floor((pct / 100) * total)
    return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`
  }

  // Count answered questions per part
  const partAnsweredCounts = listeningParts.map(
    (part: any) => part.questionIds.filter((id: any) => answers[id]).length,
  )

  console.log('partAnsweredCounts', partAnsweredCounts)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Top header ── */}
      <div className="bg-white border-b px-6 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
              <Headphones className="w-5 h-5" />
              IELTS Listening Test
            </div>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="hidden sm:inline text-sm text-gray-500">
              {answeredCount} / {totalQuestions} answered
            </span>
          </div>
          <div className="flex items-center gap-3">
            <TestTimer duration={30} onTimeUp={handleTimeUp} isActive />
            <Button size="sm" onClick={() => setShowSubmitConfirm(true)}>
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      {/* ── Audio player bar ── */}
      <div className="bg-blue-950 text-white px-6 py-3 border-b border-blue-900">
        <div className="max-w-7xl mx-auto">
          {/* Part tabs */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {listeningParts.map((part: any, i: number) => (
              <button
                key={part.id}
                onClick={() => handlePartChange(i)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  i === currentPartIndex
                    ? 'bg-white text-blue-900'
                    : audioEnded[i]
                      ? 'bg-blue-800 text-blue-300'
                      : 'bg-blue-900 text-blue-400 hover:bg-blue-800'
                }`}
              >
                {part.label}
                {partAnsweredCounts[i] > 0 && (
                  <span
                    className={`text-[10px] rounded-full px-1 ${
                      i === currentPartIndex
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-blue-700 text-blue-200'
                    }`}
                  >
                    {partAnsweredCounts[i]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="flex items-center gap-2 bg-white text-blue-900 px-3 py-1.5 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isPlaying ? 'Pause' : audioProgress > 0 ? 'Resume' : 'Play'}
            </button>

            {/* Progress */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="text-blue-300 text-xs shrink-0 w-8">
                {formatTime(audioProgress)}
              </span>
              <div className="flex-1 h-1.5 bg-blue-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all duration-1000 rounded-full"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <span className="text-blue-300 text-xs shrink-0 w-8">4:45</span>
            </div>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsMuted(m => !m)}
                className="text-blue-400 hover:text-white"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={e => {
                  setVolume(Number(e.target.value))
                  setIsMuted(false)
                }}
                className="w-16 accent-blue-400"
              />
            </div>
          </div>

          {/* Status messages */}
          {audioEnded[currentPartIndex] && (
            <p className="mt-2 text-yellow-300 text-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Audio complete — you may still review and update your answers.
            </p>
          )}
          {!isPlaying && audioProgress === 0 && (
            <p className="mt-2 text-blue-400 text-xs flex items-center gap-1">
              <Info className="w-3 h-3" />
              Simulated audio player for demonstration purposes.
            </p>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question groups */}
        <div className="lg:col-span-3 space-y-8">
          {currentPart?.groups.map((group, gi) => (
            <div key={gi} className="space-y-4">
              {/* Group header */}
              <div className="border-l-4 border-blue-400 pl-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${GROUP_TYPE_COLORS[group.type] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {GROUP_TYPE_LABELS[group.type] ?? group.type} type heee
                  </span>

                  <span className="text-xs text-gray-500">
                    Questions {group?.questionRange?.[0]}–
                    {group?.questionRange?.[1]}
                  </span>
                </div>
                {group.instructions.split('\n').map((line: any, li: number) => (
                  <p
                    key={li}
                    className={`text-sm ${li === 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Group-specific component */}
              <QuestionGroupRenderer
                group={group}
                allQuestions={allQuestions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
              />
            </div>
          ))}

          {/* Part navigation */}
          <div className="flex justify-between pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePartChange(currentPartIndex - 1)}
              disabled={currentPartIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {currentPartIndex > 0
                ? listeningParts[currentPartIndex - 1].label
                : 'Previous'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePartChange(currentPartIndex + 1)}
              disabled={currentPartIndex === listeningParts.length - 1}
            >
              {currentPartIndex < listeningParts.length - 1
                ? listeningParts[currentPartIndex + 1].label
                : 'Next'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* ── Sidebar: question navigator ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border p-4 sticky top-28 space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">
              Question Navigator
            </h3>

            {listeningParts.map((part: any, pi: number) => (
              <div key={part.id}>
                <button
                  onClick={() => handlePartChange(pi)}
                  className={`w-full text-left text-xs font-semibold px-2 py-1 rounded mb-1.5 transition-colors ${
                    pi === currentPartIndex
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {part.label}
                </button>
                <div className="grid grid-cols-5 gap-1">
                  {part.questionIds.map((qid: any) => {
                    // Derive display number directly from the question ID (e.g. 'l26' → 26)
                    const n = parseInt(qid.replace(/\D/g, ''), 10)
                    const done = !!answers[qid]
                    // l26 covers both Q26 and Q27 in the display
                    const isMulti = qid === 'l26'
                    return (
                      <button
                        key={qid}
                        onClick={() => handlePartChange(pi)}
                        title={isMulti ? `Questions 26–27` : `Question ${n}`}
                        className={`aspect-square rounded text-[11px] font-medium transition-colors ${
                          done
                            ? 'bg-green-500 text-white'
                            : pi === currentPartIndex
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        } ${isMulti ? 'col-span-1' : ''}`}
                      >
                        {isMulti ? '26-7' : n}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="pt-3 border-t space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 rounded bg-green-500" /> Answered (
                {answeredCount})
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />{' '}
                Current part
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 rounded bg-gray-100 border" /> Not
                answered
              </div>
            </div>

            {/* Question type legend */}
            <div className="pt-3 border-t">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Question Types
              </p>
              <div className="space-y-1">
                {Object.entries(GROUP_TYPE_LABELS).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${GROUP_TYPE_COLORS[type]}`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit confirmation dialog ── */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">
              Submit Listening Test?
            </h3>
            <div
              className={`p-4 rounded-lg mb-4 border ${
                answeredCount === totalQuestions
                  ? 'bg-green-50 border-green-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  answeredCount === totalQuestions
                    ? 'text-green-800'
                    : 'text-amber-800'
                }`}
              >
                {answeredCount} of {totalQuestions} questions answered.
                {answeredCount < totalQuestions && (
                  <span className="block mt-0.5">
                    {totalQuestions - answeredCount} question(s) remain
                    unanswered.
                  </span>
                )}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Once submitted you cannot change your answers.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSubmitConfirm(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit Test</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
