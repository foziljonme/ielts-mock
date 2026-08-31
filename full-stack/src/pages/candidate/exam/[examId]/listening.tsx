import React, { useState, useEffect, useRef, useMemo } from 'react'
// import { mockListeningSection } from '../data/mockData'
// import { Section, SectionQuestion, SectionQuestionGroup } from '../types'
// import { ContentBlockRenderer } from './shared/ContentBlockRenderer'
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Headphones,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { SectionType, SectionQuestion, SectionQuestionGroup } from '@/types'
import { TestTimer } from '../../components/TestTimer'
import { Button } from '@/components/button'
import { ContentBlockRenderer } from '@/shared/ContentBlockRenderer'
import useExamStore from '@/stores/exam.store'
import { ISectionWithQuestions } from '@/types/exams'
import { useWebsocket } from '@/hooks/socket/useWebsocket'
import { useSocketStore } from '@/stores/socket.store'
import { useRouter } from 'next/router'
import { CandidateLayout } from './_layout'

// ─── LISTENING SECTION (backend Section model — 4 audio tracks, 9 question groups) ──
export const mockListeningSection: any = {
  id: 'section-listening-1',
  testId: 'test-1',
  skill: 'LISTENING',
  order: 1,
  durationSec: 1800,
  instructions: 'You will hear four recordings and answer questions 1–40.',
  audioTracks: [
    {
      id: 'track-l-1',
      sectionId: 'section-listening-1',
      order: 1,
      title: 'Part 1 – Sports Centre Membership Enquiry',
      audioUrl: 'mock-part1.mp3',
    },
    {
      id: 'track-l-2',
      sectionId: 'section-listening-1',
      order: 2,
      title: 'Part 2 – Community Arts Centre Tour',
      audioUrl: 'mock-part2.mp3',
    },
    {
      id: 'track-l-3',
      sectionId: 'section-listening-1',
      order: 3,
      title: 'Part 3 – Student Research Project Discussion',
      audioUrl: 'mock-part3.mp3',
    },
    {
      id: 'track-l-4',
      sectionId: 'section-listening-1',
      order: 4,
      title: 'Part 4 – Urban Farming Lecture',
      audioUrl: 'mock-part4.mp3',
    },
  ],
  questionGroups: [
    // ── Part 1 · Form Completion (Q1–10) ──────────────────────────────────────
    {
      id: 'qg-l-1',
      sectionId: 'section-listening-1',
      audioTrackId: 'track-l-1',
      type: 'FORM_COMPLETION',
      order: 1,
      title: 'Questions 1–10',
      instructions:
        'Complete the form below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      layout: [
        {
          kind: 'heading',
          text: 'HILLSIDE SPORTS CENTRE — MEMBERSHIP ENQUIRY FORM',
        },
        { kind: 'subheading', text: 'Personal Details' },
        {
          kind: 'paragraph',
          content: [
            { kind: 'text', text: 'Title and surname: Mr ' },
            { kind: 'blank', questionId: 'ql1' },
          ],
        },
        {
          kind: 'paragraph',
          content: [
            { kind: 'text', text: 'Address: ' },
            { kind: 'blank', questionId: 'ql2' },
            { kind: 'text', text: ' Avenue, Hillside' },
          ],
        },
        { kind: 'question', questionId: 'ql3', label: 'Postcode' },
        { kind: 'question', questionId: 'ql4', label: 'Contact number' },
        {
          kind: 'paragraph',
          content: [
            { kind: 'text', text: 'Email address: ' },
            { kind: 'blank', questionId: 'ql5' },
            { kind: 'text', text: '@citymail.com' },
          ],
        },
        { kind: 'subheading', text: 'Membership Details' },
        { kind: 'question', questionId: 'ql6', label: 'Type of membership' },
        { kind: 'question', questionId: 'ql7', label: 'Preferred start date' },
        {
          kind: 'paragraph',
          content: [
            { kind: 'text', text: 'Facilities of interest: ' },
            { kind: 'blank', questionId: 'ql8' },
            { kind: 'text', text: ' and the gym' },
          ],
        },
        { kind: 'subheading', text: 'Health & Payment' },
        {
          kind: 'question',
          questionId: 'ql9',
          label: 'Medical condition noted',
        },
        {
          kind: 'question',
          questionId: 'ql10',
          label: 'Preferred payment method',
        },
      ],
      questions: [
        {
          id: 'ql1',
          questionGroupId: 'qg-l-1',
          order: 1,
          points: 1,
          correctAnswer: 'Mercer',
        },
        {
          id: 'ql2',
          questionGroupId: 'qg-l-1',
          order: 2,
          points: 1,
          correctAnswer: 'Birchwood',
        },
        {
          id: 'ql3',
          questionGroupId: 'qg-l-1',
          order: 3,
          points: 1,
          correctAnswer: 'BN3 4QT',
        },
        {
          id: 'ql4',
          questionGroupId: 'qg-l-1',
          order: 4,
          points: 1,
          correctAnswer: '07712 334 881',
        },
        {
          id: 'ql5',
          questionGroupId: 'qg-l-1',
          order: 5,
          points: 1,
          correctAnswer: 'j.mercer',
        },
        {
          id: 'ql6',
          questionGroupId: 'qg-l-1',
          order: 6,
          points: 1,
          correctAnswer: 'annual',
        },
        {
          id: 'ql7',
          questionGroupId: 'qg-l-1',
          order: 7,
          points: 1,
          correctAnswer: '1st October',
        },
        {
          id: 'ql8',
          questionGroupId: 'qg-l-1',
          order: 8,
          points: 1,
          correctAnswer: 'swimming pool',
        },
        {
          id: 'ql9',
          questionGroupId: 'qg-l-1',
          order: 9,
          points: 1,
          correctAnswer: 'asthma',
        },
        {
          id: 'ql10',
          questionGroupId: 'qg-l-1',
          order: 10,
          points: 1,
          correctAnswer: 'direct debit',
        },
      ],
    },

    // ── Part 2 · Diagram Labelling / Map (Q11–15) ─────────────────────────────
    {
      id: 'qg-l-2',
      sectionId: 'section-listening-1',
      audioTrackId: 'track-l-2',
      type: 'DIAGRAM_LABELLING',
      order: 2,
      title: 'Questions 11–15',
      instructions:
        'Label the plan below.\nWrite the correct letter, A–G, next to Questions 11–15.',
      layout: [
        {
          kind: 'list',
          items: [
            [{ kind: 'text', text: 'A   Café' }],
            [{ kind: 'text', text: 'B   Gallery' }],
            [{ kind: 'text', text: 'C   Main Hall' }],
            [{ kind: 'text', text: 'D   Reception' }],
            [{ kind: 'text', text: 'E   Recording Studio' }],
            [{ kind: 'text', text: 'F   Shop' }],
            [{ kind: 'text', text: 'G   Workshop' }],
          ],
        },
        {
          kind: 'image',
          url: 'internal:community-arts-centre-floor-plan',
          alt: 'Community Arts Centre — Ground Floor Plan',
          hotspots: [
            { questionId: 'ql11', x: 17, y: 48, markerLabel: '11' },
            { questionId: 'ql12', x: 36, y: 76, markerLabel: '12' },
            { questionId: 'ql13', x: 51, y: 48, markerLabel: '13' },
            { questionId: 'ql14', x: 17, y: 18, markerLabel: '14' },
            { questionId: 'ql15', x: 51, y: 18, markerLabel: '15' },
          ],
        },
      ],
      questions: [
        {
          id: 'ql11',
          questionGroupId: 'qg-l-2',
          order: 11,
          config: { options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
          correctAnswer: 'D',
          points: 1,
        },
        {
          id: 'ql12',
          questionGroupId: 'qg-l-2',
          order: 12,
          config: { options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
          correctAnswer: 'B',
          points: 1,
        },
        {
          id: 'ql13',
          questionGroupId: 'qg-l-2',
          order: 13,
          config: { options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
          correctAnswer: 'C',
          points: 1,
        },
        {
          id: 'ql14',
          questionGroupId: 'qg-l-2',
          order: 14,
          config: { options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
          correctAnswer: 'A',
          points: 1,
        },
        {
          id: 'ql15',
          questionGroupId: 'qg-l-2',
          order: 15,
          config: { options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
          correctAnswer: 'G',
          points: 1,
        },
      ],
    },

    // ── Part 2 · Multiple Choice (Q16–20) ─────────────────────────────────────
    {
      id: 'qg-l-3',
      sectionId: 'section-listening-1',
      audioTrackId: 'track-l-2',
      type: 'MULTIPLE_CHOICE',
      order: 3,
      title: 'Questions 16–20',
      instructions: 'Choose the correct letter, A, B or C.',
      layout: [
        { kind: 'question', questionId: 'ql16' },
        { kind: 'question', questionId: 'ql17' },
        { kind: 'question', questionId: 'ql18' },
        { kind: 'question', questionId: 'ql19' },
        { kind: 'question', questionId: 'ql20' },
      ],
      questions: [
        {
          id: 'ql16',
          questionGroupId: 'qg-l-3',
          order: 16,
          prompt: 'At what time does the heritage walk depart?',
          config: { options: ['9 am', '10 am', '11 am'] },
          correctAnswer: 'B',
          points: 1,
        },
        {
          id: 'ql17',
          questionGroupId: 'qg-l-3',
          order: 17,
          prompt: 'How long does the walk last?',
          config: {
            options: ['One hour', 'One and a half hours', 'Two hours'],
          },
          correctAnswer: 'C',
          points: 1,
        },
        {
          id: 'ql18',
          questionGroupId: 'qg-l-3',
          order: 18,
          prompt: 'What must participants bring?',
          config: {
            options: [
              'Waterproof clothing',
              'Comfortable footwear',
              'A packed lunch',
            ],
          },
          correctAnswer: 'A',
          points: 1,
        },
        {
          id: 'ql19',
          questionGroupId: 'qg-l-3',
          order: 19,
          prompt: 'In what year was the old town hall constructed?',
          config: { options: ['1856', '1874', '1892'] },
          correctAnswer: 'B',
          points: 1,
        },
        {
          id: 'ql20',
          questionGroupId: 'qg-l-3',
          order: 20,
          prompt: 'What is the cost of the audio commentary guide?',
          config: { options: ['£2.50', '£3.00', 'Free of charge'] },
          correctAnswer: 'C',
          points: 1,
        },
      ],
    },

    // ── Part 3 · Matching Features (Q21–25) ───────────────────────────────────
    {
      id: 'qg-l-4',
      sectionId: 'section-listening-1',
      audioTrackId: 'track-l-3',
      type: 'MATCHING_FEATURES',
      order: 4,
      title: 'Questions 21–25',
      instructions:
        'What does each student say about the following project tasks?\nChoose FIVE answers from the box and write the correct letter, A–D, next to Questions 21–25.',
      layout: [
        {
          kind: 'list',
          items: [
            [{ kind: 'text', text: 'A   Sarah only' }],
            [{ kind: 'text', text: 'B   James only' }],
            [{ kind: 'text', text: 'C   Both students' }],
            [
              {
                kind: 'text',
                text: 'D   Neither student (tutor will arrange)',
              },
            ],
          ],
        },
        { kind: 'question', questionId: 'ql21' },
        { kind: 'question', questionId: 'ql22' },
        { kind: 'question', questionId: 'ql23' },
        { kind: 'question', questionId: 'ql24' },
        { kind: 'question', questionId: 'ql25' },
      ],
      questions: [
        {
          id: 'ql21',
          questionGroupId: 'qg-l-4',
          order: 21,
          prompt: 'Writing the literature review',
          config: { options: ['A', 'B', 'C', 'D'] },
          correctAnswer: 'A',
          points: 1,
        },
        {
          id: 'ql22',
          questionGroupId: 'qg-l-4',
          order: 22,
          prompt: 'Designing the questionnaire',
          config: { options: ['A', 'B', 'C', 'D'] },
          correctAnswer: 'C',
          points: 1,
        },
        {
          id: 'ql23',
          questionGroupId: 'qg-l-4',
          order: 23,
          prompt: 'Analysing the quantitative data',
          config: { options: ['A', 'B', 'C', 'D'] },
          correctAnswer: 'B',
          points: 1,
        },
        {
          id: 'ql24',
          questionGroupId: 'qg-l-4',
          order: 24,
          prompt: 'Booking the interview rooms',
          config: { options: ['A', 'B', 'C', 'D'] },
          correctAnswer: 'D',
          points: 1,
        },
        {
          id: 'ql25',
          questionGroupId: 'qg-l-4',
          order: 25,
          prompt: 'Proofreading the final report',
          config: { options: ['A', 'B', 'C', 'D'] },
          correctAnswer: 'A',
          points: 1,
        },
      ],
    },

    // ── Part 3 · Multiple Choice Multi-Answer (Q26–27) ────────────────────────
    {
      id: 'qg-l-5',
      sectionId: 'section-listening-1',
      audioTrackId: 'track-l-3',
      type: 'MULTIPLE_CHOICE_MULTI_ANSWER',
      order: 5,
      title: 'Questions 26–27',
      instructions: 'Choose TWO letters, A–E.',
      layout: [{ kind: 'question', questionId: 'ql26' }],
      questions: [
        {
          id: 'ql26',
          questionGroupId: 'qg-l-5',
          order: 26,
          prompt:
            'Which TWO problems with their project do the students mention?',
          config: {
            options: [
              'Difficulty recruiting participants',
              'Unclear research question',
              'Deadline too tight',
              'Limited access to databases',
              'Disagreement on methodology',
            ],
            requiredCount: 2,
            displayRange: '26–27',
          },
          correctAnswer: ['A', 'C'],
          points: 2,
        },
      ],
    },

    // ── Part 3 · Multiple Choice (Q28–30) ─────────────────────────────────────
    {
      id: 'qg-l-6',
      sectionId: 'section-listening-1',
      audioTrackId: 'track-l-3',
      type: 'MULTIPLE_CHOICE',
      order: 6,
      title: 'Questions 28–30',
      instructions: 'Choose the correct letter, A, B or C.',
      layout: [
        { kind: 'question', questionId: 'ql28' },
        { kind: 'question', questionId: 'ql29' },
        { kind: 'question', questionId: 'ql30' },
      ],
      questions: [
        {
          id: 'ql28',
          questionGroupId: 'qg-l-6',
          order: 28,
          prompt: 'What does the tutor advise them to do first?',
          config: {
            options: [
              'Revise the research question',
              'Complete the online survey',
              'Meet the interviewees',
            ],
          },
          correctAnswer: 'B',
          points: 1,
        },
        {
          id: 'ql29',
          questionGroupId: 'qg-l-6',
          order: 29,
          prompt:
            'How often should they meet with their tutor during the project?',
          config: {
            options: ['Once a week', 'Every two weeks', 'Once a month'],
          },
          correctAnswer: 'A',
          points: 1,
        },
        {
          id: 'ql30',
          questionGroupId: 'qg-l-6',
          order: 30,
          prompt: 'What is the final word limit for their report?',
          config: { options: ['5,000 words', '7,500 words', '10,000 words'] },
          correctAnswer: 'B',
          points: 1,
        },
      ],
    },

    // ── Part 4 · Table Completion (Q31–35) ────────────────────────────────────
    {
      id: 'qg-l-7',
      sectionId: 'section-listening-1',
      audioTrackId: 'track-l-4',
      type: 'TABLE_COMPLETION',
      order: 7,
      title: 'Questions 31–35',
      instructions:
        'Complete the table below.\nWrite ONE WORD ONLY for each answer.',
      layout: [
        {
          kind: 'table',
          caption: 'Urban Farming Techniques',
          columns: ['Technique', 'Key Benefit', 'Main Challenge'],
          rows: [
            [
              { kind: 'text', text: 'Hydroponics' },
              {
                kind: 'rich',
                content: [
                  { kind: 'blank', questionId: 'ql31' },
                  { kind: 'text', text: ' soil needed' },
                ],
              },
              { kind: 'text', text: 'High setup costs' },
            ],
            [
              { kind: 'text', text: 'Vertical farming' },
              {
                kind: 'rich',
                content: [
                  { kind: 'text', text: 'Space ' },
                  { kind: 'blank', questionId: 'ql32' },
                ],
              },
              { kind: 'text', text: 'High energy use' },
            ],
            [
              { kind: 'text', text: 'Rooftop gardens' },
              { kind: 'text', text: 'Improved insulation' },
              {
                kind: 'rich',
                content: [
                  { kind: 'text', text: 'Structural ' },
                  { kind: 'blank', questionId: 'ql33' },
                ],
              },
            ],
            [
              { kind: 'text', text: 'Aquaponics' },
              { kind: 'text', text: 'Combines fish + plants' },
              {
                kind: 'rich',
                content: [
                  { kind: 'text', text: 'System ' },
                  { kind: 'blank', questionId: 'ql34' },
                ],
              },
            ],
            [
              { kind: 'text', text: 'Microgreens' },
              {
                kind: 'rich',
                content: [
                  { kind: 'text', text: 'Fast ' },
                  { kind: 'blank', questionId: 'ql35' },
                ],
              },
              { kind: 'text', text: 'Short shelf life' },
            ],
          ],
        },
      ],
      questions: [
        {
          id: 'ql31',
          questionGroupId: 'qg-l-7',
          order: 31,
          correctAnswer: 'no',
          points: 1,
        },
        {
          id: 'ql32',
          questionGroupId: 'qg-l-7',
          order: 32,
          correctAnswer: 'efficient',
          points: 1,
        },
        {
          id: 'ql33',
          questionGroupId: 'qg-l-7',
          order: 33,
          correctAnswer: 'loading',
          points: 1,
        },
        {
          id: 'ql34',
          questionGroupId: 'qg-l-7',
          order: 34,
          correctAnswer: 'complexity',
          points: 1,
        },
        {
          id: 'ql35',
          questionGroupId: 'qg-l-7',
          order: 35,
          correctAnswer: 'growth',
          points: 1,
        },
      ],
    },

    // ── Part 4 · Note Completion (Q36–37) ─────────────────────────────────────
    {
      id: 'qg-l-8',
      sectionId: 'section-listening-1',
      audioTrackId: 'track-l-4',
      type: 'NOTE_COMPLETION',
      order: 8,
      title: 'Questions 36–37',
      instructions:
        'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      layout: [
        { kind: 'heading', text: 'Key Statistics — Urban Farming Lecture' },
        {
          kind: 'list',
          items: [
            [
              { kind: 'text', text: 'Urban agriculture can use up to ' },
              { kind: 'blank', questionId: 'ql36' },
              { kind: 'text', text: ' less water than conventional farming' },
            ],
            [
              { kind: 'text', text: 'By 2050, approximately ' },
              { kind: 'blank', questionId: 'ql37' },
              {
                kind: 'text',
                text: "% of the world's population will live in cities",
              },
            ],
          ],
        },
      ],
      questions: [
        {
          id: 'ql36',
          questionGroupId: 'qg-l-8',
          order: 36,
          correctAnswer: '90%',
          points: 1,
        },
        {
          id: 'ql37',
          questionGroupId: 'qg-l-8',
          order: 37,
          correctAnswer: '68',
          points: 1,
        },
      ],
    },

    // ── Part 4 · Short Answer (Q38–40) ────────────────────────────────────────
    {
      id: 'qg-l-9',
      sectionId: 'section-listening-1',
      audioTrackId: 'track-l-4',
      type: 'SHORT_ANSWER',
      order: 9,
      title: 'Questions 38–40',
      instructions:
        'Answer the questions below.\nWrite NO MORE THAN THREE WORDS for each answer.',
      layout: [
        { kind: 'question', questionId: 'ql38' },
        { kind: 'question', questionId: 'ql39' },
        { kind: 'question', questionId: 'ql40' },
      ],
      questions: [
        {
          id: 'ql38',
          questionGroupId: 'qg-l-9',
          order: 38,
          prompt:
            'What type of fish is most commonly raised in aquaponics systems?',
          correctAnswer: 'tilapia',
          points: 1,
        },
        {
          id: 'ql39',
          questionGroupId: 'qg-l-9',
          order: 39,
          prompt:
            'Which city does the lecturer identify as a global leader in urban farming?',
          correctAnswer: 'Singapore',
          points: 1,
        },
        {
          id: 'ql40',
          questionGroupId: 'qg-l-9',
          order: 40,
          prompt:
            'What is the single biggest barrier to urban farming expansion?',
          correctAnswer: 'high initial costs',
          points: 1,
        },
      ],
    },
  ],
}

const GROUP_TYPE_LABELS: Record<string, string> = {
  FORM_COMPLETION: 'Form Completion',
  DIAGRAM_LABELLING: 'Plan / Map Labelling',
  MATCHING_FEATURES: 'Matching',
  MATCHING_HEADING: 'Matching',
  MATCHING_INFORMATION: 'Matching',
  MATCHING_SENTENCE_ENDINGS: 'Matching',
  MULTIPLE_CHOICE: 'Multiple Choice',
  MULTIPLE_CHOICE_MULTI_ANSWER: 'Multiple Choice (Choose TWO)',
  NOTE_COMPLETION: 'Note Completion',
  TABLE_COMPLETION: 'Table Completion',
  SHORT_ANSWER: 'Short Answer',
}

const GROUP_TYPE_COLORS: Record<string, string> = {
  FORM_COMPLETION: 'bg-blue-100 text-blue-700',
  DIAGRAM_LABELLING: 'bg-purple-100 text-purple-700',
  MATCHING_FEATURES: 'bg-indigo-100 text-indigo-700',
  MATCHING_HEADING: 'bg-indigo-100 text-indigo-700',
  MATCHING_INFORMATION: 'bg-indigo-100 text-indigo-700',
  MATCHING_SENTENCE_ENDINGS: 'bg-indigo-100 text-indigo-700',
  MULTIPLE_CHOICE: 'bg-green-100 text-green-700',
  MULTIPLE_CHOICE_MULTI_ANSWER: 'bg-teal-100 text-teal-700',
  NOTE_COMPLETION: 'bg-amber-100 text-amber-700',
  TABLE_COMPLETION: 'bg-orange-100 text-orange-700',
  SHORT_ANSWER: 'bg-rose-100 text-rose-700',
}

export default function ListeningSection() {
  const { fetchCurrentSection, activeSection, submitSection, autoSave } =
    useExamStore()
  // const { activeSection } = useExamStore()
  // const activeSection = mockListeningSection
  const tracks = useMemo(
    () =>
      (activeSection?.audioTracks ?? [])
        .slice()
        .sort((a, b) => a.order - b.order),
    [activeSection],
  )
  console.log('activeSectionaaaaaa', activeSection?.questionGroups)
  console.log('mockListeningSection', mockListeningSection.questionGroups)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [debounce, setDebounse] = useState<Record<string, any>>({})
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [audioEnded, setAudioEnded] = useState<boolean[]>(() =>
    new Array(tracks.length).fill(false),
  )
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  console.log('answersanswers', answers)
  const currentTrack = tracks[currentTrackIdx]

  // Groups for the currently-visible part, sorted by group order
  const currentGroups = useMemo(
    () =>
      activeSection
        ? activeSection?.questionGroups
            .filter(g => g.audioTrackId === currentTrack?.id)
            .sort((a, b) => a.order - b.order)
        : [],
    [activeSection, currentTrack],
  )

  const currentGroupsConst = mockListeningSection?.questionGroups
    .filter((g: any) => g.audioTrackId === currentTrack?.id)
    .sort((a: any, b: any) => a.order - b.order)

  console.log('currentGroups', currentGroups)
  console.log('currentGroupsConst', mockListeningSection?.questionGroups)

  // Flat question lookup used by ContentBlockRenderer
  const questionsById = useMemo(() => {
    if (!activeSection) return {}
    const map: Record<string, SectionQuestion> = {}
    for (const g of activeSection?.questionGroups || []) {
      for (const q of g.questions) map[q.id] = q
    }

    return map
  }, [activeSection])

  // Total display question count (Q26-27 is one entry that covers two numbers)
  const totalDisplayCount = 40

  const answeredCount = Object.values(answers).filter(Boolean).length

  // Simulate audio progress
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            setAudioEnded(e => {
              const n = [...e]
              n[currentTrackIdx] = true
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
  }, [isPlaying, currentTrackIdx])

  const handleTrackChange = (index: number) => {
    setIsPlaying(false)
    setAudioProgress(0)
    setCurrentTrackIdx(index)
  }

  const handleAnswerChange = (qid: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qid]: val }))
    const plannedDebounses = { ...debounce }
    if (debounce[qid]) {
      clearTimeout(debounce[qid])
      plannedDebounses[qid] = null
    }
    const autosaveTimeout = setTimeout(async () => {
      await autoSave(qid, val)
    }, 5000)

    setDebounse({ ...plannedDebounses, [qid]: autosaveTimeout })
  }

  const handleBlur = async (qid: string, val: string) => {
    await autoSave(qid, val)
    if (debounce[qid]) {
      clearTimeout(debounce[qid])
    }
  }

  const handleSubmit = () => submitSection(answers)
  const handleTimeUp = () => {
    // onTimeUp()
    handleSubmit()
  }

  const formatTime = (pct: number) => {
    const secs = Math.floor((pct / 100) * 285)
    return `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`
  }

  // Per-track answered counts for the tab badges
  const trackAnsweredCounts = useMemo(
    () =>
      tracks.map(track => {
        const qids = activeSection?.questionGroups
          .filter(g => g.audioTrackId === track.id)
          .flatMap(g => g.questions.map(q => q.id))
        return qids ? qids.filter(id => answers[id]).length : 0
      }),
    [tracks, activeSection, answers],
  )

  // Question range label for a group header
  const groupRangeLabel = (group: SectionQuestionGroup) => {
    const orders = group.questions.map(q => q.order)
    if (orders.length === 0) return ''
    const min = Math.min(...orders)
    const max = Math.max(...orders)
    const multiQ = group.questions.find(
      q => (q.config as Record<string, unknown>)?.displayRange,
    )
    if (multiQ)
      return String((multiQ.config as Record<string, unknown>).displayRange)
    return min === max ? String(min) : `${min}–${max}`
  }

  useEffect(() => {
    fetchCurrentSection()
  }, [fetchCurrentSection])

  useEffect(() => {
    handleTrackChange(3)
  }, [])

  useEffect(() => {})

  if (!activeSection) {
    return null
  }

  return (
    <CandidateLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* ── Header ── */}
        <div className="bg-white border-b px-6 py-3 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
                <Headphones className="w-5 h-5" />
                IELTS Listening Test
              </div>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="hidden sm:inline text-sm text-gray-500">
                {answeredCount} / {totalDisplayCount} answered
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
              {tracks.map((track, i) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackChange(i)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    i === currentTrackIdx
                      ? 'bg-white text-blue-900'
                      : audioEnded[i]
                        ? 'bg-blue-800 text-blue-300'
                        : 'bg-blue-900 text-blue-400 hover:bg-blue-800'
                  }`}
                >
                  Part {track.order}
                  {trackAnsweredCounts[i] > 0 && (
                    <span
                      className={`text-[10px] rounded-full px-1 ${
                        i === currentTrackIdx
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-blue-700 text-blue-200'
                      }`}
                    >
                      {trackAnsweredCounts[i]}
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

            {audioEnded[currentTrackIdx] && (
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
            {currentGroups.map(group => (
              <div key={group.id} className="space-y-4">
                {/* Group header */}
                <div className="border-l-4 border-blue-400 pl-4">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${GROUP_TYPE_COLORS[group.type] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {GROUP_TYPE_LABELS[group.type] ?? group.type}
                    </span>
                    {group.title && (
                      <span className="text-xs text-gray-500">
                        {group.title}
                      </span>
                    )}
                  </div>
                  {group.instructions.split('\n').map((line, li) => (
                    <p
                      key={li}
                      className={`text-sm ${li === 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Layout-driven renderer */}
                <ContentBlockRenderer
                  blocks={group.layout as any}
                  groupType={group.type}
                  questionsById={questionsById}
                  answersById={answers}
                  onAnswerChange={handleAnswerChange}
                  onBlur={handleBlur}
                />
              </div>
            ))}

            {/* Part navigation */}
            <div className="flex justify-between pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTrackChange(currentTrackIdx - 1)}
                disabled={currentTrackIdx === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {currentTrackIdx > 0
                  ? `Part ${tracks[currentTrackIdx - 1].order}`
                  : 'Previous'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTrackChange(currentTrackIdx + 1)}
                disabled={currentTrackIdx === tracks.length - 1}
              >
                {currentTrackIdx < tracks.length - 1
                  ? `Part ${tracks[currentTrackIdx + 1].order}`
                  : 'Next'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* ── Sidebar: navigator ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-4 sticky top-28 space-y-4">
              <h3 className="font-semibold text-sm text-gray-700">
                Question Navigator
              </h3>

              {tracks.map((track, pi) => {
                const trackGroups = activeSection?.questionGroups
                  .filter(g => g.audioTrackId === track.id)
                  .sort((a, b) => a.order - b.order)
                const trackQuestions = trackGroups
                  .flatMap(g => g.questions)
                  .sort((a, b) => a.order - b.order)

                return (
                  <div key={track.id}>
                    <button
                      onClick={() => handleTrackChange(pi)}
                      className={`w-full text-left text-xs font-semibold px-2 py-1 rounded mb-1.5 transition-colors ${
                        pi === currentTrackIdx
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Part {track.order}
                    </button>
                    <div className="grid grid-cols-5 gap-1">
                      {trackQuestions.map(q => {
                        const cfg = (q.config ?? {}) as Record<string, unknown>
                        const displayRange = cfg.displayRange as
                          | string
                          | undefined
                        const done = !!answers[q.id]
                        return (
                          <button
                            key={q.id}
                            onClick={() => {
                              if (pi !== currentTrackIdx) handleTrackChange(pi)
                              setTimeout(
                                () => {
                                  document
                                    .getElementById(`q-${q.id}`)
                                    ?.scrollIntoView({
                                      behavior: 'smooth',
                                      block: 'center',
                                    })
                                },
                                pi !== currentTrackIdx ? 120 : 0,
                              )
                            }}
                            title={
                              displayRange
                                ? `Questions ${displayRange}`
                                : `Question ${q.order}`
                            }
                            className={`aspect-square rounded text-[10px] font-medium transition-colors ${
                              done
                                ? 'bg-green-500 text-white'
                                : pi === currentTrackIdx
                                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {displayRange ? `${q.order}+` : q.order}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

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
            </div>
          </div>
        </div>

        {/* ── Submit confirmation ── */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-3">
                Submit Listening Test?
              </h3>
              <div
                className={`p-4 rounded-lg mb-4 border ${
                  answeredCount === totalDisplayCount
                    ? 'bg-green-50 border-green-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    answeredCount === totalDisplayCount
                      ? 'text-green-800'
                      : 'text-amber-800'
                  }`}
                >
                  {answeredCount} of {totalDisplayCount} questions answered.
                  {answeredCount < totalDisplayCount && (
                    <span className="block mt-0.5">
                      {totalDisplayCount - answeredCount} question(s) remain
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
    </CandidateLayout>
  )
}
