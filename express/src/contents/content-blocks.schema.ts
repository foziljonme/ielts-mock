import { z } from "zod";

// =============================================================================
// This file defines the JSON contract behind four Prisma Json columns:
//   Passage.content        -> ContentBlock[]
//   AudioTrack.transcript   -> ContentBlock[]
//   QuestionGroup.layout    -> ContentBlock[]
//   Question.config         -> QuestionConfigByType[group.type]
//   Question.correctAnswer  -> QuestionCorrectAnswerByType[group.type]
//
// No Prisma model changes are needed — these are the shapes that live inside
// the existing Json fields, validated the same way TestLoader already
// validates the rest of a test with Zod.
// =============================================================================

// -----------------------------------------------------------------------------
// INLINE NODES
// The atomic unit inside a paragraph, list item, table cell, or flow-chart
// node. Mixing "text" and "blank" in one array is what lets a blank sit in
// the middle of a sentence (Sentence/Summary/Note Completion) instead of
// only ever being its own block.
// -----------------------------------------------------------------------------
const InlineTextNode = z.object({ kind: z.literal("text"), text: z.string() });
const InlineEmphasisNode = z.object({
  kind: z.literal("emphasis"),
  text: z.string(),
});
const InlineBlankNode = z.object({
  kind: z.literal("blank"),
  questionId: z.string(),
  label: z.string().optional(), // "Name:" for a form field; omitted for a bare inline blank
});

export const InlineNode = z.discriminatedUnion("kind", [
  InlineTextNode,
  InlineEmphasisNode,
  InlineBlankNode,
]);
export type InlineNode = z.infer<typeof InlineNode>;

const RichText = z.array(InlineNode);
export type RichText = z.infer<typeof RichText>;

// -----------------------------------------------------------------------------
// TABLE (Table Completion)
// -----------------------------------------------------------------------------
export const TableCell = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("text"),
    text: z.string(),
    header: z.boolean().optional(),
    colspan: z.number().int().positive().optional(),
    rowspan: z.number().int().positive().optional(),
  }),
  z.object({
    kind: z.literal("blank"),
    questionId: z.string(),
    colspan: z.number().int().positive().optional(),
    rowspan: z.number().int().positive().optional(),
  }),
]);
export type TableCell = z.infer<typeof TableCell>;

// -----------------------------------------------------------------------------
// DIAGRAM (Diagram Labelling) — image + numbered hotspots
// -----------------------------------------------------------------------------
export const DiagramHotspot = z.object({
  questionId: z.string(),
  x: z.number().min(0).max(100), // % from left, relative to the image
  y: z.number().min(0).max(100), // % from top
  markerLabel: z.string().optional(), // pre-printed marker on the source image, e.g. "A"
});
export type DiagramHotspot = z.infer<typeof DiagramHotspot>;

// -----------------------------------------------------------------------------
// FLOW CHART (Flow-chart Completion)
// -----------------------------------------------------------------------------
export const FlowChartNode = z.object({
  id: z.string(),
  content: RichText, // text + optional blank(s) inside the box
});
export const FlowChartConnection = z.object({
  from: z.string(),
  to: z.string(),
});

// -----------------------------------------------------------------------------
// CONTENT BLOCK
// The frontend renders an array of these top-to-bottom. A "question" block
// or inline "blank" node never carries the question's own data — it only
// marks where to render the input for Question.id.
// -----------------------------------------------------------------------------
export const ContentBlock = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("heading"), text: z.string() }),
  z.object({ kind: z.literal("subheading"), text: z.string() }),
  z.object({
    kind: z.literal("paragraph"),
    label: z.string().optional(), // "A" / "B" paragraph markers, for Matching Headings/Information
    content: RichText,
  }),
  z.object({ kind: z.literal("instruction"), text: z.string() }),
  z.object({
    kind: z.literal("image"),
    url: z.string().url(),
    alt: z.string().optional(),
    hotspots: z.array(DiagramHotspot).optional(), // present for Diagram Labelling
  }),
  z.object({
    kind: z.literal("question"),
    questionId: z.string(),
    label: z.string().optional(), // standalone field label, e.g. "Name:" on its own line
  }),
  z.object({
    kind: z.literal("table"),
    caption: z.string().optional(),
    columns: z.array(z.string()),
    rows: z.array(z.array(TableCell)),
  }),
  z.object({
    kind: z.literal("list"),
    ordered: z.boolean().optional(),
    items: z.array(RichText), // bullet notes, or an option/heading/feature bank
  }),
  z.object({
    kind: z.literal("flow-chart"),
    nodes: z.array(RichText),
    // connections: z.array(FlowChartConnection),
  }),
  z.object({ kind: z.literal("divider") }),
]);
export type ContentBlock = z.infer<typeof ContentBlock>;
export const ContentBlockArray = z.array(ContentBlock);

// =============================================================================
// PER-QUESTION-TYPE CONFIG + CORRECT ANSWER CONTRACTS
// Question.config / Question.correctAnswer stay Json in Prisma on purpose,
// but every QuestionType has one fixed shape. Look these up by the parent
// QuestionGroup.type when validating (TestLoader) or rendering (frontend).
// =============================================================================
const Option = z.object({ label: z.string(), text: z.string() }); // { label: "B", text: "..." }
const wordLimit = z.object({ maxWords: z.number().int().positive() });

export const QuestionConfigByType = {
  MULTIPLE_CHOICE: z.object({ options: z.array(Option).min(2) }),
  MULTIPLE_CHOICE_MULTI_ANSWER: z.object({
    options: z.array(Option).min(3),
    selectCount: z.number().int().min(2),
  }),
  TRUE_FALSE_NOT_GIVEN: z.object({}).strict(),
  YES_NO_NOT_GIVEN: z.object({}).strict(),
  MATCHING_HEADING: z.object({}).strict(), // heading bank lives in the group's `list` layout block
  MATCHING_INFORMATION: z.object({}).strict(), // paragraph labels come from Passage.content
  MATCHING_FEATURES: z
    .object({
      options: z.array(z.string()).min(2),
    })
    .strict(), // feature bank lives in the group's `list` layout block
  MATCHING_SENTENCE_ENDINGS: z.object({}).strict(), // ending bank lives in the group's `list` layout block
  SENTENCE_COMPLETION: wordLimit,
  SUMMARY_COMPLETION: wordLimit.extend({
    wordBank: z.array(z.string()).optional(),
  }),
  NOTE_COMPLETION: wordLimit,
  TABLE_COMPLETION: wordLimit,
  FORM_COMPLETION: wordLimit,
  FLOW_CHART_COMPLETION: wordLimit.extend({
    wordBank: z.array(z.string()).optional(),
  }),
  DIAGRAM_LABELLING: wordLimit,
  SHORT_ANSWER: wordLimit,
  WRITING_TASK: z.object({
    minWords: z.number().int().positive(),
    taskImageUrl: z.string().url().optional(), // Task 1 chart/graph/diagram
  }),
  SPEAKING_PROMPT: z.object({
    partNumber: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    prepTimeSec: z.number().int().nonnegative().optional(),
    speakTimeSec: z.number().int().positive().optional(),
  }),
} as const satisfies Record<string, z.ZodTypeAny>;

export const QuestionCorrectAnswerByType = {
  MULTIPLE_CHOICE: z.string(), // option label, e.g. "B"
  MULTIPLE_CHOICE_MULTI_ANSWER: z.array(z.string()).min(2), // e.g. ["B", "D"]
  TRUE_FALSE_NOT_GIVEN: z.enum(["TRUE", "FALSE", "NOT_GIVEN"]),
  YES_NO_NOT_GIVEN: z.enum(["YES", "NO", "NOT_GIVEN"]),
  MATCHING_HEADING: z.string(), // heading option label, e.g. "iv"
  MATCHING_INFORMATION: z.string(), // paragraph label, e.g. "C"
  MATCHING_FEATURES: z.string(), // feature bank label
  MATCHING_SENTENCE_ENDINGS: z.string(), // ending option label
  SENTENCE_COMPLETION: z.union([z.string(), z.array(z.string())]), // accepted variants
  SUMMARY_COMPLETION: z.union([z.string(), z.array(z.string())]),
  NOTE_COMPLETION: z.union([z.string(), z.array(z.string())]),
  TABLE_COMPLETION: z.union([z.string(), z.array(z.string())]),
  FORM_COMPLETION: z.union([z.string(), z.array(z.string())]),
  FLOW_CHART_COMPLETION: z.union([z.string(), z.array(z.string())]),
  DIAGRAM_LABELLING: z.union([z.string(), z.array(z.string())]),
  SHORT_ANSWER: z.union([z.string(), z.array(z.string())]),
  WRITING_TASK: z.null(), // human-graded
  SPEAKING_PROMPT: z.null(), // human-graded
} as const satisfies Record<string, z.ZodTypeAny>;

export type IeltsQuestionType = keyof typeof QuestionConfigByType;

export function getConfigSchema(type: IeltsQuestionType) {
  return QuestionConfigByType[type];
}
export function getCorrectAnswerSchema(type: IeltsQuestionType) {
  return QuestionCorrectAnswerByType[type];
}
