// ==========================================================================
// toRenderShape — FRONTEND ONLY. Presentational reshape of already-public data.
// ==========================================================================
// This file lives in the UI codebase, not the content/server package.
// It never sees `correctAnswer` because the type it accepts (PublicSection)
// doesn't have that field — grading reads the raw Test object directly on
// the server and never goes through this function at all. If you find
// yourself wanting to add an "includeAnswers" flag here, stop: that means
// something is trying to route answer data through the frontend, which
// means the leak already happened at the API layer, not here.

import type {
  PublicSection,
  PublicQuestion,
  PublicQuestionGroup,
  Segment,
} from './publicSchema'

export const GROUP_TYPE_LABELS: Record<string, string> = {
  'form-completion': 'Form Completion',
  'note-completion': 'Note Completion',
  'summary-completion': 'Summary Completion',
  'sentence-completion': 'Sentence Completion',
  'table-completion': 'Table Completion',
  'flow-chart-completion': 'Flow-Chart Completion',
  'map-labelling': 'Plan / Map Labelling',
  matching: 'Matching',
  'multiple-choice': 'Multiple Choice',
  'multiple-choice-multi': 'Multiple Choice (Choose TWO)',
  'short-answer': 'Short Answer',
  'true-false-not-given': 'True / False / Not Given',
  'writing-task': 'Writing Task',
}

export const GROUP_TYPE_COLORS: Record<string, string> = {
  'form-completion': 'bg-blue-100 text-blue-700',
  'note-completion': 'bg-amber-100 text-amber-700',
  'summary-completion': 'bg-amber-100 text-amber-700',
  'sentence-completion': 'bg-amber-100 text-amber-700',
  'table-completion': 'bg-orange-100 text-orange-700',
  'flow-chart-completion': 'bg-orange-100 text-orange-700',
  'map-labelling': 'bg-purple-100 text-purple-700',
  matching: 'bg-indigo-100 text-indigo-700',
  'multiple-choice': 'bg-green-100 text-green-700',
  'multiple-choice-multi': 'bg-teal-100 text-teal-700',
  'short-answer': 'bg-rose-100 text-rose-700',
  'true-false-not-given': 'bg-cyan-100 text-cyan-700',
  'writing-task': 'bg-slate-100 text-slate-700',
}

// Canonical QuestionType -> UI kebab-case type key
const TYPE_MAP: Record<string, string> = {
  FORM_COMPLETION: 'form-completion',
  NOTE_COMPLETION: 'note-completion',
  SUMMARY_COMPLETION: 'summary-completion',
  SENTENCE_COMPLETION: 'sentence-completion',
  TABLE_COMPLETION: 'table-completion',
  FLOW_CHART_COMPLETION: 'flow-chart-completion',
  PLAN_MAP_LABELING: 'map-labelling',
  MATCHING: 'matching',
  MATCHING_HEADINGS: 'matching',
  MATCHING_FEATURES: 'matching',
  MATCHING_INFORMATION: 'matching',
  MULTIPLE_CHOICE_SINGLE: 'multiple-choice',
  MULTIPLE_CHOICE_MULTI: 'multiple-choice-multi',
  SHORT_ANSWER: 'short-answer',
  TRUE_FALSE_NOT_GIVEN: 'true-false-not-given',
  YES_NO_NOT_GIVEN: 'true-false-not-given',
  WRITING_TASK1: 'writing-task',
  WRITING_TASK2: 'writing-task',
}

export interface RenderQuestion {
  id: string
  type: string // kebab-case UI type
  question: string // Question.prompt
  displayNumbers: number[]
  options?: string[]
  wordLimit?: number
  // deliberately no correctAnswer field — PublicQuestion never carries one
}

export interface RenderGroup {
  type: string
  instructions: string
  questionIds: string[]
  questionRange: [number, number]
  // Type-specific structural data, only populated when the group's layout matches
  formSections?: { label?: string; segments: Segment[] }[]
  tableHeaders?: string[]
  tableRows?: Segment[][][]
  flowSteps?: Segment[][]
  mapTitle?: string
  mapRegions?: unknown[]
  matchingOptions?: string[]
}

export interface RenderPart {
  id: string
  label: string
  audioTrackId?: string
  passageId?: string
  groups: RenderGroup[]
}

export interface RenderSection {
  section: string
  questions: RenderQuestion[]
  parts: RenderPart[]
}

function renderQuestion(q: PublicQuestion): RenderQuestion {
  const out: RenderQuestion = {
    id: q.id,
    type: TYPE_MAP[q.type] ?? q.type.toLowerCase(),
    question: q.prompt,
    displayNumbers: q.displayNumbers,
  }
  if (q.config?.options) out.options = q.config.options as string[]
  if (q.config?.maxWordsPerBlank)
    out.wordLimit = q.config.maxWordsPerBlank as number
  if (q.config?.maxWords) out.wordLimit = q.config.maxWords as number
  return out
}

function renderGroup(g: PublicQuestionGroup): RenderGroup {
  const nums = g.questions.flatMap(q => q.displayNumbers)
  const out: RenderGroup = {
    type: TYPE_MAP[g.questions[0]?.type] ?? 'unknown',
    instructions: g.instructions,
    questionIds: g.questions.map(q => q.id),
    questionRange: [Math.min(...nums), Math.max(...nums)],
  }

  if (g.sharedOptions) out.matchingOptions = g.sharedOptions

  if (g.layout?.kind === 'list') {
    out.formSections = g.layout.items.map(item => ({
      label: item.label,
      segments: item.line,
    }))
  } else if (g.layout?.kind === 'table') {
    out.tableHeaders = g.layout.headers
    out.tableRows = g.layout.rows
  } else if (g.layout?.kind === 'flowchart') {
    out.flowSteps = g.layout.steps
  } else if (g.layout?.kind === 'map') {
    out.mapTitle = g.layout.title
    out.mapRegions = g.layout.regions
  }

  return out
}

function partLabel(index: number): string {
  return `Part ${index + 1}`
}

/**
 * Reshape a single PublicSection (already answer-stripped, already fetched
 * from GET /me/current-section) into the flat parts/groups/questions shape
 * the React components consume.
 */
export function toRenderShape(section: PublicSection): RenderSection {
  // Group QuestionGroups by their audioTrackId/passageId to form "parts",
  // matching the audioTrackId ordering (Part 1, Part 2, ...) or passage
  // ordering for Reading.
  const partKeyOf = (g: PublicQuestionGroup) =>
    g.audioTrackId ?? g.passageId ?? 'default'
  const partKeys: string[] = []
  for (const g of section.groups) {
    const key = partKeyOf(g)
    if (!partKeys.includes(key)) partKeys.push(key)
  }

  const parts: RenderPart[] = partKeys.map((key, i) => ({
    id: `part-${i + 1}`,
    label: partLabel(i),
    audioTrackId: section.audioTracks?.find(a => a.id === key)?.id,
    passageId: section.passages?.find(p => p.id === key)?.id,
    groups: section.groups.filter(g => partKeyOf(g) === key).map(renderGroup),
  }))

  const questions: RenderQuestion[] = section.groups
    .flatMap(g => g.questions)
    .sort((a, b) => a.displayNumbers[0] - b.displayNumbers[0])
    .map(renderQuestion)

  return { section: section.section, questions, parts }
}
