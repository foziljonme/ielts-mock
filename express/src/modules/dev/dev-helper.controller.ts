import { faker } from "@faker-js/faker";
import {
  ExamSeatStatus,
  ExamStatus,
  QuestionType,
  TestSkill,
  UserRole,
} from "../../../prisma/generated/enums";
import db from "@/config/db";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Prisma } from "../../../prisma/generated/client";
const debug = require("debug")("myapp:server");

const candidateGenerator = (count: number) => {
  const candidates = [];
  for (let i = 0; i < count; i++) {
    candidates.push({
      candidateName: faker.person.firstName() + " " + faker.person.lastName(),
      candidateContact: faker.phone.number(),
    });
  }
  return candidates;
};

const tenants = [
  {
    subdomain: "saas",
    name: "SaaS",
    seatQuota: 20,
    users: [
      {
        name: "saas@test.net",
        email: "saas@test.net",
        password: "something123",
        roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    ],
  },
  {
    subdomain: "hello-academy",
    name: "Hello Academy",
    seatQuota: 30,
    users: [
      {
        name: "admin@global-academy.com",
        email: "admin@global-academy.com",
        password: "something123",
        roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.STAFF],
      },
    ],
    sessions: [
      {
        testId: "cambridge-16-test-3",
        examDate: "2026-01-22T13:00",
        seats: candidateGenerator(Math.floor(Math.random() * 10)),
      },
      {
        testId: "cambridge-16-test-4",
        examDate: "2026-01-22T13:00",
        seats: candidateGenerator(Math.floor(Math.random() * 10)),
      },
    ],
  },
];

/**
 * Development seed
 *
 * This creates ONE complete, tenant-agnostic IELTS Academic test and all of
 * its content:
 *   - 4 sections
 *   - 3 Reading passages
 *   - 4 Listening audio tracks
 *   - all QuestionType enum values
 *   - Writing Tasks 1 + 2
 *   - Speaking Parts 1, 2 and 3
 *
 * The content is original development/demo content, not a Cambridge test.
 *
 * Question IDs are deterministic so they can safely be referenced from
 * QuestionGroup.layout.
 */

type SeedQuestion = {
  id: string;
  order: number;
  prompt?: string;
  config?: any;
  correctAnswer?: any;
  points?: number;
};

type SeedGroup = {
  id: string;
  sectionId: string;
  passageId?: string;
  audioTrackId?: string;
  type: QuestionType;
  order: number;
  title?: string;
  instructions: string;
  layout: any[];
  questions: SeedQuestion[];
};

const testId = "dev-test-all-question-types";

const ids = {
  listening: "dev-section-listening",
  reading: "dev-section-reading",
  writing: "dev-section-writing",
  speaking: "dev-section-speaking",

  passage1: "dev-passage-1",
  passage2: "dev-passage-2",
  passage3: "dev-passage-3",

  audio1: "dev-audio-1",
  audio2: "dev-audio-2",
  audio3: "dev-audio-3",
  audio4: "dev-audio-4",
};

const q = (id: string) => ({ kind: "question", questionId: id });

const readingPassages = [
  {
    id: ids.passage1,
    order: 1,
    title: "The Hidden Life of Urban Trees",
    source: "Original development content",
    content: [
      { kind: "heading", text: "The Hidden Life of Urban Trees" },
      {
        kind: "paragraph",
        label: "A",
        text: "Cities are often described as concrete environments, yet trees form a living infrastructure that changes temperature, stores carbon and provides habitat. Their value is not limited to parks. A single mature tree can influence the conditions of several buildings and streets around it.",
      },
      {
        kind: "paragraph",
        label: "B",
        text: "The cooling effect of trees is produced in two main ways. Their leaves create shade, while water released through tiny openings in the leaves removes heat from the surrounding air. Researchers have found that the combined effect can be especially noticeable in neighbourhoods with large areas of asphalt.",
      },
      {
        kind: "paragraph",
        label: "C",
        text: "Not all urban trees, however, receive the same benefits from their surroundings. Compacted soil restricts root growth, underground construction can remove valuable root space, and poorly chosen planting sites may expose trees to excessive heat or drought.",
      },
      {
        kind: "paragraph",
        label: "D",
        text: "Recent projects have therefore moved away from treating a tree as an isolated object. Designers increasingly create connected planting areas in which roots have access to larger volumes of soil. Some projects also collect rainwater from nearby roofs and direct it towards planting beds.",
      },
      {
        kind: "paragraph",
        label: "E",
        text: "The long-term success of these projects depends on maintenance. Young trees need water while their root systems develop, and damaged branches may need attention after storms. A city that plants thousands of trees without budgeting for maintenance may gain much less benefit than expected.",
      },
    ],
  },
  {
    id: ids.passage2,
    order: 2,
    title: "How Museums Became Interactive",
    source: "Original development content",
    content: [
      { kind: "heading", text: "How Museums Became Interactive" },
      {
        kind: "paragraph",
        label: "A",
        text: "For much of the twentieth century, museums commonly presented objects in cases with labels that supplied historical information. Visitors were expected to observe carefully and move from one display to the next. This model remains important, but many institutions now supplement it with more participatory experiences.",
      },
      {
        kind: "paragraph",
        label: "B",
        text: "Interactive displays first became widespread in science museums, where visitors could operate levers, buttons and simple mechanical demonstrations. The aim was not merely entertainment. Designers wanted visitors to test ideas and see consequences immediately.",
      },
      {
        kind: "paragraph",
        label: "C",
        text: "Digital technology expanded the range of possible interactions. Touchscreens can provide several levels of explanation, while projection systems can reconstruct environments that no longer exist. Nevertheless, technology itself does not guarantee learning. A poorly designed digital display may distract visitors from the object it was intended to explain.",
      },
      {
        kind: "paragraph",
        label: "D",
        text: "Some museums now invite visitors to contribute information. Community archives may collect photographs, memories or recordings from local residents. Curators then assess these materials and may incorporate them into exhibitions, creating a collection that changes as new evidence is added.",
      },
      {
        kind: "paragraph",
        label: "E",
        text: "The strongest interactive exhibitions tend to combine physical objects with carefully designed questions. Instead of telling visitors exactly what to notice, the exhibition encourages them to compare, predict or interpret. This approach can make a short visit feel more intellectually active.",
      },
    ],
  },
  {
    id: ids.passage3,
    order: 3,
    title: "The Science of Sleep Timing",
    source: "Original development content",
    content: [
      { kind: "heading", text: "The Science of Sleep Timing" },
      {
        kind: "paragraph",
        label: "A",
        text: "Sleep is regulated by several biological processes rather than by tiredness alone. One of the most important is the circadian rhythm, an approximately twenty-four-hour cycle that influences alertness, body temperature and the release of hormones.",
      },
      {
        kind: "paragraph",
        label: "B",
        text: "Light is one of the strongest signals used by the body clock. Exposure to bright light at particular times can shift the timing of sleep, which is one reason travellers may experience difficulty after crossing several time zones.",
      },
      {
        kind: "paragraph",
        label: "C",
        text: "People also differ naturally in when they feel most alert. Some are more comfortable waking early, while others tend to become active later in the day. These differences are influenced by biology, age and daily routines.",
      },
      {
        kind: "paragraph",
        label: "D",
        text: "Researchers distinguish between sleep quantity and sleep timing. A person may obtain an adequate number of hours but sleep at a time that conflicts with work or school requirements. Repeated conflicts can make concentration and mood more difficult to manage.",
      },
      {
        kind: "paragraph",
        label: "E",
        text: "Practical interventions often focus on regularity. Keeping wake time relatively stable, reducing strong light immediately before bed and obtaining daylight earlier in the day can help reinforce a consistent schedule.",
      },
    ],
  },
];

const audioTracks = [
  {
    id: ids.audio1,
    order: 1,
    title: "Library Membership Enquiry",
    audioUrl: "/audio/dev/listening-part-1.mp3",
    transcript: [
      {
        kind: "paragraph",
        text: "Receptionist: Good morning, Riverside Library. How can I help?",
      },
      {
        kind: "paragraph",
        text: "Visitor: I would like to join. I have just moved into the area.",
      },
      {
        kind: "paragraph",
        text: "Receptionist: Certainly. We need your address and a form of identification.",
      },
      { kind: "paragraph", text: "Visitor: Is there a charge?" },
      {
        kind: "paragraph",
        text: "Receptionist: The standard membership is free. There is a small replacement fee if a card is lost.",
      },
    ],
  },
  {
    id: ids.audio2,
    order: 2,
    title: "Student Housing Orientation",
    audioUrl: "/audio/dev/listening-part-2.mp3",
    transcript: [
      {
        kind: "paragraph",
        text: "Welcome to North Campus accommodation. The laundry room is on the ground floor, beside the bicycle storage area.",
      },
      {
        kind: "paragraph",
        text: "Residents should reserve washing machines through the building application during busy periods.",
      },
      {
        kind: "paragraph",
        text: "The study room is on the second floor and is available until 10 p.m.",
      },
      {
        kind: "paragraph",
        text: "The courtyard is closed after 9 p.m. because bedrooms surround it.",
      },
    ],
  },
  {
    id: ids.audio3,
    order: 3,
    title: "Lecture: Pollinators and Food Production",
    audioUrl: "/audio/dev/listening-part-3.mp3",
    transcript: [
      {
        kind: "paragraph",
        text: "Lecturer: Today we are looking at pollination in agricultural systems. Bees are important, but they are not the only pollinators.",
      },
      { kind: "paragraph", text: "Student: Do farms need to keep wild areas?" },
      {
        kind: "paragraph",
        text: "Lecturer: In many cases, yes. Flowering margins can provide food and shelter during periods when crops are not flowering.",
      },
      {
        kind: "paragraph",
        text: "Student: So the margin is useful even when it is not producing the crop?",
      },
      {
        kind: "paragraph",
        text: "Lecturer: Exactly. It can support insects throughout the season.",
      },
    ],
  },
  {
    id: ids.audio4,
    order: 4,
    title: "Lecture: Designing Better Public Spaces",
    audioUrl: "/audio/dev/listening-part-4.mp3",
    transcript: [
      {
        kind: "paragraph",
        text: "Today I want to discuss how people actually use public spaces rather than how planners expect them to be used.",
      },
      {
        kind: "paragraph",
        text: "Observation studies often reveal informal pathways, temporary seating areas and changes in use at different times of day.",
      },
      {
        kind: "paragraph",
        text: "One important lesson is that flexibility can be more valuable than a visually perfect fixed arrangement.",
      },
      {
        kind: "paragraph",
        text: "For example, movable chairs allow groups to change the arrangement according to their needs.",
      },
    ],
  },
];

const groups: SeedGroup[] = [
  // ========================================================================
  // LISTENING
  // ========================================================================

  {
    id: "lg1",
    sectionId: ids.listening,
    audioTrackId: ids.audio1,
    type: QuestionType.FORM_COMPLETION,
    order: 1,
    title: "Questions 1-4",
    instructions:
      "Complete the membership form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
    layout: [
      { kind: "heading", text: "Riverside Library Membership" },
      {
        kind: "table",
        columns: ["Field", "Answer"],
        rows: [
          ["Full name", q("l1")],
          ["Street address", q("l2")],
          ["Identification type", q("l3")],
          ["Replacement card fee", q("l4")],
        ],
      },
    ],
    questions: [
      {
        id: "l1",
        order: 1,
        config: { maxWords: 2 },
        correctAnswer: ["Daniel Price"],
      },
      {
        id: "l2",
        order: 2,
        config: { maxWords: 3 },
        correctAnswer: ["18 Willow Road"],
      },
      {
        id: "l3",
        order: 3,
        config: { maxWords: 2 },
        correctAnswer: ["passport"],
      },
      {
        id: "l4",
        order: 4,
        config: { maxWords: 3 },
        correctAnswer: ["five pounds", "£5", "5 pounds"],
      },
    ],
  },

  {
    id: "lg2",
    sectionId: ids.listening,
    audioTrackId: ids.audio1,
    type: QuestionType.MULTIPLE_CHOICE,
    order: 2,
    title: "Question 5",
    instructions: "Choose the correct answer, A, B or C.",
    layout: [{ kind: "question", questionId: "l5" }],
    questions: [
      {
        id: "l5",
        order: 5,
        prompt: "What does the visitor want to borrow first?",
        config: {
          options: ["A. A laptop", "B. A novel", "C. A study room key"],
        },
        correctAnswer: "B",
      },
    ],
  },

  {
    id: "lg3",
    sectionId: ids.listening,
    audioTrackId: ids.audio2,
    type: QuestionType.MATCHING_FEATURES,
    order: 3,
    title: "Questions 6-8",
    instructions:
      "Match each facility with the correct location. Choose from the locations A-D.",
    layout: [
      {
        kind: "list",
        items: [
          "A. Ground floor",
          "B. First floor",
          "C. Second floor",
          "D. Courtyard",
        ],
      },
      q("l6"),
      q("l7"),
      q("l8"),
    ],
    questions: [
      {
        id: "l6",
        order: 6,
        prompt: "Laundry room",
        config: { options: ["A", "B", "C", "D"] },
        correctAnswer: "A",
      },
      {
        id: "l7",
        order: 7,
        prompt: "Study room",
        config: { options: ["A", "B", "C", "D"] },
        correctAnswer: "C",
      },
      {
        id: "l8",
        order: 8,
        prompt: "Outdoor social area",
        config: { options: ["A", "B", "C", "D"] },
        correctAnswer: "D",
      },
    ],
  },

  {
    id: "lg4",
    sectionId: ids.listening,
    audioTrackId: ids.audio2,
    type: QuestionType.SENTENCE_COMPLETION,
    order: 4,
    title: "Questions 9-10",
    instructions: "Complete the sentences. Write NO MORE THAN TWO WORDS.",
    layout: [q("l9"), q("l10")],
    questions: [
      {
        id: "l9",
        order: 9,
        prompt:
          "Residents should reserve washing machines through the ________.",
        config: { maxWords: 1 },
        correctAnswer: ["building application", "application"],
      },
      {
        id: "l10",
        order: 10,
        prompt: "The study room closes at ________.",
        config: { maxWords: 2 },
        correctAnswer: ["10 pm", "10 p.m.", "10pm"],
      },
    ],
  },

  {
    id: "lg5",
    sectionId: ids.listening,
    audioTrackId: ids.audio3,
    type: QuestionType.MULTIPLE_CHOICE_MULTI_ANSWER,
    order: 5,
    title: "Questions 11-12",
    instructions: "Choose TWO answers.",
    layout: [
      {
        kind: "list",
        items: [
          "A. Bees",
          "B. Butterflies",
          "C. Flowering margins",
          "D. Large tractors",
          "E. Night lighting",
        ],
      },
      q("l11"),
      q("l12"),
    ],
    questions: [
      {
        id: "l11",
        order: 11,
        prompt: "Which TWO features can support pollinators?",
        config: { options: ["A", "B", "C", "D", "E"], selectionLimit: 2 },
        correctAnswer: ["A", "C"],
      },
      {
        id: "l12",
        order: 12,
        prompt: "Which TWO features can support pollinators?",
        config: { options: ["A", "B", "C", "D", "E"], selectionLimit: 2 },
        correctAnswer: ["A", "C"],
      },
    ],
  },

  {
    id: "lg6",
    sectionId: ids.listening,
    audioTrackId: ids.audio3,
    type: QuestionType.NOTE_COMPLETION,
    order: 6,
    title: "Questions 13-15",
    instructions: "Complete the notes. Write NO MORE THAN TWO WORDS.",
    layout: [
      { kind: "heading", text: "Pollinator support" },
      {
        kind: "paragraph",
        text: "Flowering margins can provide food and ________.",
      },
      q("l13"),
      {
        kind: "paragraph",
        text: "They are useful when crops are not ________.",
      },
      q("l14"),
      {
        kind: "paragraph",
        text: "The aim is to support insects throughout the ________.",
      },
      q("l15"),
    ],
    questions: [
      {
        id: "l13",
        order: 13,
        config: { maxWords: 2 },
        correctAnswer: ["shelter"],
      },
      {
        id: "l14",
        order: 14,
        config: { maxWords: 2 },
        correctAnswer: ["flowering"],
      },
      {
        id: "l15",
        order: 15,
        config: { maxWords: 2 },
        correctAnswer: ["season"],
      },
    ],
  },

  {
    id: "lg7",
    sectionId: ids.listening,
    audioTrackId: ids.audio4,
    type: QuestionType.TABLE_COMPLETION,
    order: 7,
    title: "Questions 16-18",
    instructions:
      "Complete the table. Write NO MORE THAN TWO WORDS for each answer.",
    layout: [
      {
        kind: "table",
        columns: ["Observed feature", "Example"],
        rows: [
          ["Movement", q("l16")],
          ["Seating", q("l17")],
          ["Furniture", q("l18")],
        ],
      },
    ],
    questions: [
      {
        id: "l16",
        order: 16,
        config: { maxWords: 2 },
        correctAnswer: ["informal pathways"],
      },
      {
        id: "l17",
        order: 17,
        config: { maxWords: 2 },
        correctAnswer: ["temporary seating"],
      },
      {
        id: "l18",
        order: 18,
        config: { maxWords: 2 },
        correctAnswer: ["movable chairs"],
      },
    ],
  },

  {
    id: "lg8",
    sectionId: ids.listening,
    audioTrackId: ids.audio4,
    type: QuestionType.FLOW_CHART_COMPLETION,
    order: 8,
    title: "Questions 19-20",
    instructions: "Complete the flow chart. Write NO MORE THAN TWO WORDS.",
    layout: [
      { kind: "heading", text: "Studying public spaces" },
      {
        kind: "list",
        items: [
          "Observe actual use",
          "Identify ________",
          "Compare use at different times",
          "Design for ________",
        ],
      },
      q("l19"),
      q("l20"),
    ],
    questions: [
      {
        id: "l19",
        order: 19,
        config: { maxWords: 2 },
        correctAnswer: ["informal pathways"],
      },
      {
        id: "l20",
        order: 20,
        config: { maxWords: 2 },
        correctAnswer: ["flexibility"],
      },
    ],
  },

  {
    id: "lg9",
    sectionId: ids.listening,
    audioTrackId: ids.audio4,
    type: QuestionType.DIAGRAM_LABELLING,
    order: 9,
    title: "Questions 21-22",
    instructions: "Label the diagram. Choose the correct letter, A-D.",
    layout: [
      {
        kind: "image",
        url: "/images/dev/public-space-plan.svg",
        alt: "Simple public-space plan",
      },
      q("l21"),
      q("l22"),
    ],
    questions: [
      {
        id: "l21",
        order: 21,
        prompt: "Movable seating zone",
        config: {
          labels: ["A", "B", "C", "D"],
          image: "/images/dev/public-space-plan.svg",
          hotspots: { A: [20, 20], B: [70, 20], C: [20, 70], D: [70, 70] },
        },
        correctAnswer: "C",
      },
      {
        id: "l22",
        order: 22,
        prompt: "Main observation point",
        config: {
          labels: ["A", "B", "C", "D"],
          image: "/images/dev/public-space-plan.svg",
          hotspots: { A: [20, 20], B: [70, 20], C: [20, 70], D: [70, 70] },
        },
        correctAnswer: "A",
      },
    ],
  },

  {
    id: "lg10",
    sectionId: ids.listening,
    audioTrackId: ids.audio4,
    type: QuestionType.SHORT_ANSWER,
    order: 10,
    title: "Questions 23-24",
    instructions: "Answer the questions. Write NO MORE THAN THREE WORDS.",
    layout: [q("l23"), q("l24")],
    questions: [
      {
        id: "l23",
        order: 23,
        prompt: "What can movable chairs allow groups to change?",
        config: { maxWords: 3 },
        correctAnswer: ["the arrangement", "arrangement"],
      },
      {
        id: "l24",
        order: 24,
        prompt:
          "What quality may be more valuable than a visually perfect fixed arrangement?",
        config: { maxWords: 2 },
        correctAnswer: ["flexibility"],
      },
    ],
  },

  // ========================================================================
  // READING
  // ========================================================================

  {
    id: "rg1",
    sectionId: ids.reading,
    passageId: ids.passage1,
    type: QuestionType.MATCHING_HEADING,
    order: 1,
    title: "Questions 1-5",
    instructions: "Choose the correct heading for each paragraph A-E.",
    layout: [
      {
        kind: "list",
        items: [
          "i. The importance of continued care",
          "ii. Designing space below the ground",
          "iii. Two mechanisms of cooling",
          "iv. Trees as part of city infrastructure",
          "v. Unequal conditions for urban trees",
          "vi. The history of urban forestry",
        ],
      },
      q("r1"),
      q("r2"),
      q("r3"),
      q("r4"),
      q("r5"),
    ],
    questions: [
      {
        id: "r1",
        order: 1,
        prompt: "Paragraph A",
        config: { options: ["i", "ii", "iii", "iv", "v", "vi"] },
        correctAnswer: "iv",
      },
      {
        id: "r2",
        order: 2,
        prompt: "Paragraph B",
        config: { options: ["i", "ii", "iii", "iv", "v", "vi"] },
        correctAnswer: "iii",
      },
      {
        id: "r3",
        order: 3,
        prompt: "Paragraph C",
        config: { options: ["i", "ii", "iii", "iv", "v", "vi"] },
        correctAnswer: "v",
      },
      {
        id: "r4",
        order: 4,
        prompt: "Paragraph D",
        config: { options: ["i", "ii", "iii", "iv", "v", "vi"] },
        correctAnswer: "ii",
      },
      {
        id: "r5",
        order: 5,
        prompt: "Paragraph E",
        config: { options: ["i", "ii", "iii", "iv", "v", "vi"] },
        correctAnswer: "i",
      },
    ],
  },

  {
    id: "rg2",
    sectionId: ids.reading,
    passageId: ids.passage1,
    type: QuestionType.TRUE_FALSE_NOT_GIVEN,
    order: 2,
    title: "Questions 6-8",
    instructions:
      "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
    layout: [q("r6"), q("r7"), q("r8")],
    questions: [
      {
        id: "r6",
        order: 6,
        prompt:
          "Urban trees can affect conditions beyond the exact area beneath their branches.",
        config: { options: ["TRUE", "FALSE", "NOT GIVEN"] },
        correctAnswer: "TRUE",
      },
      {
        id: "r7",
        order: 7,
        prompt:
          "Every city provides the same soil conditions for newly planted trees.",
        config: { options: ["TRUE", "FALSE", "NOT GIVEN"] },
        correctAnswer: "FALSE",
      },
      {
        id: "r8",
        order: 8,
        prompt:
          "The passage states that most urban trees survive for more than fifty years.",
        config: { options: ["TRUE", "FALSE", "NOT GIVEN"] },
        correctAnswer: "NOT GIVEN",
      },
    ],
  },

  {
    id: "rg3",
    sectionId: ids.reading,
    passageId: ids.passage1,
    type: QuestionType.MATCHING_INFORMATION,
    order: 3,
    title: "Questions 9-11",
    instructions:
      "Which paragraph contains the following information? Write the correct letter A-E.",
    layout: [q("r9"), q("r10"), q("r11")],
    questions: [
      {
        id: "r9",
        order: 9,
        prompt: "A reference to water being redirected towards planting areas",
        config: { options: ["A", "B", "C", "D", "E"] },
        correctAnswer: "D",
      },
      {
        id: "r10",
        order: 10,
        prompt: "An explanation of how leaves contribute to cooling",
        config: { options: ["A", "B", "C", "D", "E"] },
        correctAnswer: "B",
      },
      {
        id: "r11",
        order: 11,
        prompt: "A warning about the consequences of insufficient maintenance",
        config: { options: ["A", "B", "C", "D", "E"] },
        correctAnswer: "E",
      },
    ],
  },

  {
    id: "rg4",
    sectionId: ids.reading,
    passageId: ids.passage2,
    type: QuestionType.MATCHING_FEATURES,
    order: 4,
    title: "Questions 12-14",
    instructions: "Match each feature with the museum approach A-C.",
    layout: [
      {
        kind: "list",
        items: [
          "A. Traditional display",
          "B. Interactive display",
          "C. Community archive",
        ],
      },
      q("r12"),
      q("r13"),
      q("r14"),
    ],
    questions: [
      {
        id: "r12",
        order: 12,
        prompt: "Visitors operate a mechanical demonstration.",
        config: { options: ["A", "B", "C"] },
        correctAnswer: "B",
      },
      {
        id: "r13",
        order: 13,
        prompt: "Local residents contribute photographs and memories.",
        config: { options: ["A", "B", "C"] },
        correctAnswer: "C",
      },
      {
        id: "r14",
        order: 14,
        prompt: "Objects are presented with explanatory labels.",
        config: { options: ["A", "B", "C"] },
        correctAnswer: "A",
      },
    ],
  },

  {
    id: "rg5",
    sectionId: ids.reading,
    passageId: ids.passage2,
    type: QuestionType.MATCHING_SENTENCE_ENDINGS,
    order: 5,
    title: "Questions 15-17",
    instructions: "Complete each sentence with the correct ending.",
    layout: [
      {
        kind: "list",
        items: [
          "A. can distract visitors from the object.",
          "B. can encourage visitors to test ideas.",
          "C. changes when new evidence is added.",
          "D. requires no curator involvement.",
        ],
      },
      q("r15"),
      q("r16"),
      q("r17"),
    ],
    questions: [
      {
        id: "r15",
        order: 15,
        prompt: "Interactive science displays",
        config: { options: ["A", "B", "C", "D"] },
        correctAnswer: "B",
      },
      {
        id: "r16",
        order: 16,
        prompt: "Poorly designed digital technology",
        config: { options: ["A", "B", "C", "D"] },
        correctAnswer: "A",
      },
      {
        id: "r17",
        order: 17,
        prompt: "A community archive",
        config: { options: ["A", "B", "C", "D"] },
        correctAnswer: "C",
      },
    ],
  },

  {
    id: "rg6",
    sectionId: ids.reading,
    passageId: ids.passage2,
    type: QuestionType.MULTIPLE_CHOICE,
    order: 6,
    title: "Questions 18-20",
    instructions: "Choose the correct answer, A, B, C or D.",
    layout: [q("r18"), q("r19"), q("r20")],
    questions: [
      {
        id: "r18",
        order: 18,
        prompt: "What was one purpose of early interactive displays?",
        config: {
          options: [
            "A. To replace all museum objects",
            "B. To encourage visitors to test ideas",
            "C. To reduce museum staffing",
            "D. To make labels longer",
          ],
        },
        correctAnswer: "B",
      },
      {
        id: "r19",
        order: 19,
        prompt: "What does the passage say about digital technology?",
        config: {
          options: [
            "A. It always improves learning",
            "B. It is only useful in science museums",
            "C. Its educational value depends on design",
            "D. It has replaced physical objects",
          ],
        },
        correctAnswer: "C",
      },
      {
        id: "r20",
        order: 20,
        prompt:
          "What do strong interactive exhibitions encourage visitors to do?",
        config: {
          options: [
            "A. Memorise labels",
            "B. Avoid interpretation",
            "C. Compare and predict",
            "D. Move quickly between rooms",
          ],
        },
        correctAnswer: "C",
      },
    ],
  },

  {
    id: "rg7",
    sectionId: ids.reading,
    passageId: ids.passage3,
    type: QuestionType.YES_NO_NOT_GIVEN,
    order: 7,
    title: "Questions 21-23",
    instructions:
      "Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.",
    layout: [q("r21"), q("r22"), q("r23")],
    questions: [
      {
        id: "r21",
        order: 21,
        prompt: "Light is an important signal for the body clock.",
        config: { options: ["YES", "NO", "NOT GIVEN"] },
        correctAnswer: "YES",
      },
      {
        id: "r22",
        order: 22,
        prompt: "Everyone has the same natural preferred time for waking.",
        config: { options: ["YES", "NO", "NOT GIVEN"] },
        correctAnswer: "NO",
      },
      {
        id: "r23",
        order: 23,
        prompt:
          "The writer recommends sleeping exactly eight hours every night.",
        config: { options: ["YES", "NO", "NOT GIVEN"] },
        correctAnswer: "NOT GIVEN",
      },
    ],
  },

  {
    id: "rg8",
    sectionId: ids.reading,
    passageId: ids.passage3,
    type: QuestionType.SENTENCE_COMPLETION,
    order: 8,
    title: "Questions 24-26",
    instructions: "Complete the sentences. Write NO MORE THAN TWO WORDS.",
    layout: [q("r24"), q("r25"), q("r26")],
    questions: [
      {
        id: "r24",
        order: 24,
        prompt: "The circadian rhythm is an approximately ________ cycle.",
        config: { maxWords: 2 },
        correctAnswer: ["twenty-four-hour", "24-hour"],
      },
      {
        id: "r25",
        order: 25,
        prompt:
          "Crossing time zones can cause difficulty because light can shift the timing of ________.",
        config: { maxWords: 2 },
        correctAnswer: ["sleep"],
      },
      {
        id: "r26",
        order: 26,
        prompt:
          "Researchers distinguish between sleep quantity and sleep ________.",
        config: { maxWords: 1 },
        correctAnswer: ["timing"],
      },
    ],
  },

  {
    id: "rg9",
    sectionId: ids.reading,
    passageId: ids.passage3,
    type: QuestionType.SUMMARY_COMPLETION,
    order: 9,
    title: "Questions 27-29",
    instructions: "Complete the summary. Write NO MORE THAN TWO WORDS.",
    layout: [
      { kind: "heading", text: "Summary of practical interventions" },
      {
        kind: "paragraph",
        text: "A regular schedule can be reinforced by keeping the ________ time stable.",
      },
      q("r27"),
      {
        kind: "paragraph",
        text: "People should reduce strong ________ before bed.",
      },
      q("r28"),
      {
        kind: "paragraph",
        text: "Earlier exposure to ________ can help reinforce a consistent schedule.",
      },
      q("r29"),
    ],
    questions: [
      {
        id: "r27",
        order: 27,
        config: { maxWords: 2 },
        correctAnswer: ["wake"],
      },
      {
        id: "r28",
        order: 28,
        config: { maxWords: 1 },
        correctAnswer: ["light"],
      },
      {
        id: "r29",
        order: 29,
        config: { maxWords: 1 },
        correctAnswer: ["daylight"],
      },
    ],
  },

  {
    id: "rg10",
    sectionId: ids.reading,
    passageId: ids.passage1,
    type: QuestionType.NOTE_COMPLETION,
    order: 10,
    title: "Questions 30-32",
    instructions: "Complete the notes. Write NO MORE THAN TWO WORDS.",
    layout: [
      { kind: "heading", text: "Urban tree management" },
      {
        kind: "paragraph",
        text: "Trees can reduce street temperatures through shade and ________.",
      },
      q("r30"),
      {
        kind: "paragraph",
        text: "Underground construction can reduce available ________ space.",
      },
      q("r31"),
      {
        kind: "paragraph",
        text: "Young trees need ________ while roots develop.",
      },
      q("r32"),
    ],
    questions: [
      {
        id: "r30",
        order: 30,
        config: { maxWords: 2 },
        correctAnswer: ["water release"],
      },
      {
        id: "r31",
        order: 31,
        config: { maxWords: 2 },
        correctAnswer: ["root"],
      },
      {
        id: "r32",
        order: 32,
        config: { maxWords: 1 },
        correctAnswer: ["water"],
      },
    ],
  },

  {
    id: "rg11",
    sectionId: ids.reading,
    passageId: ids.passage2,
    type: QuestionType.TABLE_COMPLETION,
    order: 11,
    title: "Questions 33-35",
    instructions: "Complete the table. Write NO MORE THAN TWO WORDS.",
    layout: [
      {
        kind: "table",
        columns: ["Museum approach", "Typical feature"],
        rows: [
          ["Traditional", q("r33")],
          ["Interactive", q("r34")],
          ["Community", q("r35")],
        ],
      },
    ],
    questions: [
      {
        id: "r33",
        order: 33,
        config: { maxWords: 2 },
        correctAnswer: ["explanatory labels"],
      },
      {
        id: "r34",
        order: 34,
        config: { maxWords: 2 },
        correctAnswer: ["mechanical demonstrations"],
      },
      {
        id: "r35",
        order: 35,
        config: { maxWords: 2 },
        correctAnswer: ["local contributions"],
      },
    ],
  },

  {
    id: "rg12",
    sectionId: ids.reading,
    passageId: ids.passage1,
    type: QuestionType.FORM_COMPLETION,
    order: 12,
    title: "Questions 36-37",
    instructions: "Complete the form. Write NO MORE THAN TWO WORDS.",
    layout: [
      { kind: "heading", text: "Urban tree project" },
      {
        kind: "table",
        columns: ["Item", "Information"],
        rows: [
          ["Water source", q("r36")],
          ["Long-term requirement", q("r37")],
        ],
      },
    ],
    questions: [
      {
        id: "r36",
        order: 36,
        config: { maxWords: 2 },
        correctAnswer: ["nearby roofs", "roofs"],
      },
      {
        id: "r37",
        order: 37,
        config: { maxWords: 2 },
        correctAnswer: ["maintenance budget", "maintenance"],
      },
    ],
  },

  {
    id: "rg13",
    sectionId: ids.reading,
    passageId: ids.passage3,
    type: QuestionType.FLOW_CHART_COMPLETION,
    order: 13,
    title: "Questions 38-39",
    instructions: "Complete the flow chart. Write NO MORE THAN TWO WORDS.",
    layout: [
      {
        kind: "list",
        items: [
          "Stable wake time",
          "Reduce strong ________ before bed",
          "Obtain ________ earlier in the day",
        ],
      },
      q("r38"),
      q("r39"),
    ],
    questions: [
      {
        id: "r38",
        order: 38,
        config: { maxWords: 1 },
        correctAnswer: ["light"],
      },
      {
        id: "r39",
        order: 39,
        config: { maxWords: 1 },
        correctAnswer: ["daylight"],
      },
    ],
  },

  {
    id: "rg14",
    sectionId: ids.reading,
    passageId: ids.passage2,
    type: QuestionType.DIAGRAM_LABELLING,
    order: 14,
    title: "Questions 40-41",
    instructions:
      "Label the museum display diagram. Choose the correct letter, A-D.",
    layout: [
      {
        kind: "image",
        url: "/images/dev/museum-display.svg",
        alt: "Simple museum display diagram",
      },
      q("r40"),
      q("r41"),
    ],
    questions: [
      {
        id: "r40",
        order: 40,
        prompt: "Interactive control",
        config: {
          labels: ["A", "B", "C", "D"],
          image: "/images/dev/museum-display.svg",
          hotspots: { A: [20, 20], B: [70, 20], C: [20, 70], D: [70, 70] },
        },
        correctAnswer: "B",
      },
      {
        id: "r41",
        order: 41,
        prompt: "Object case",
        config: {
          labels: ["A", "B", "C", "D"],
          image: "/images/dev/museum-display.svg",
          hotspots: { A: [20, 20], B: [70, 20], C: [20, 70], D: [70, 70] },
        },
        correctAnswer: "A",
      },
    ],
  },

  {
    id: "rg15",
    sectionId: ids.reading,
    passageId: ids.passage3,
    type: QuestionType.SHORT_ANSWER,
    order: 15,
    title: "Questions 42-43",
    instructions: "Answer the questions. Write NO MORE THAN THREE WORDS.",
    layout: [q("r42"), q("r43")],
    questions: [
      {
        id: "r42",
        order: 42,
        prompt:
          "What is one factor, besides biology, that can influence when people feel most alert?",
        config: { maxWords: 2 },
        correctAnswer: ["age"],
      },
      {
        id: "r43",
        order: 43,
        prompt:
          "What should be kept relatively stable to reinforce a consistent schedule?",
        config: { maxWords: 2 },
        correctAnswer: ["wake time"],
      },
    ],
  },

  // ========================================================================
  // WRITING
  // ========================================================================

  {
    id: "wg1",
    sectionId: ids.writing,
    type: QuestionType.WRITING_TASK,
    order: 1,
    title: "Writing Task 1",
    instructions: "Write at least 150 words.",
    layout: [{ kind: "heading", text: "Writing Task 1" }, q("w1")],
    questions: [
      {
        id: "w1",
        order: 1,
        prompt:
          "The table below shows the percentage of commuters using four forms of transport in a city in 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
        config: {
          task: 1,
          minWords: 150,
          chart: {
            type: "table",
            columns: ["Transport", "2005", "2025"],
            rows: [
              ["Car", "62%", "44%"],
              ["Bus", "21%", "25%"],
              ["Bicycle", "7%", "18%"],
              ["Train", "10%", "13%"],
            ],
          },
        },
        points: 0,
      },
    ],
  },

  {
    id: "wg2",
    sectionId: ids.writing,
    type: QuestionType.WRITING_TASK,
    order: 2,
    title: "Writing Task 2",
    instructions: "Write at least 250 words.",
    layout: [{ kind: "heading", text: "Writing Task 2" }, q("w2")],
    questions: [
      {
        id: "w2",
        order: 2,
        prompt:
          "Some people believe that cities should spend more money improving public transport rather than building new roads. To what extent do you agree or disagree?",
        config: {
          task: 2,
          minWords: 250,
        },
        points: 0,
      },
    ],
  },

  // ========================================================================
  // SPEAKING
  // ========================================================================

  {
    id: "sg1",
    sectionId: ids.speaking,
    type: QuestionType.SPEAKING_PROMPT,
    order: 1,
    title: "Speaking Part 1",
    instructions: "Answer the questions naturally. This task is human-graded.",
    layout: [
      { kind: "heading", text: "Part 1 — Introduction and Interview" },
      q("s1"),
      q("s2"),
      q("s3"),
    ],
    questions: [
      {
        id: "s1",
        order: 1,
        prompt: "Do you prefer studying in the morning or in the evening? Why?",
        config: { part: 1, preparationSec: 0, responseSec: 30 },
        points: 0,
      },
      {
        id: "s2",
        order: 2,
        prompt: "What kind of public places do you enjoy visiting?",
        config: { part: 1, preparationSec: 0, responseSec: 30 },
        points: 0,
      },
      {
        id: "s3",
        order: 3,
        prompt: "Do you often use public transport?",
        config: { part: 1, preparationSec: 0, responseSec: 30 },
        points: 0,
      },
    ],
  },

  {
    id: "sg2",
    sectionId: ids.speaking,
    type: QuestionType.SPEAKING_PROMPT,
    order: 2,
    title: "Speaking Part 2",
    instructions:
      "You have one minute to prepare. Speak for one to two minutes.",
    layout: [{ kind: "heading", text: "Part 2 — Long Turn" }, q("s4")],
    questions: [
      {
        id: "s4",
        order: 4,
        prompt:
          "Describe a public place that you think is well designed. You should say where it is, what it looks like, what people do there, and explain why you think it is well designed.",
        config: { part: 2, preparationSec: 60, responseSec: 120 },
        points: 0,
      },
    ],
  },

  {
    id: "sg3",
    sectionId: ids.speaking,
    type: QuestionType.SPEAKING_PROMPT,
    order: 3,
    title: "Speaking Part 3",
    instructions:
      "Discuss the questions in greater depth. This task is human-graded.",
    layout: [
      { kind: "heading", text: "Part 3 — Discussion" },
      q("s5"),
      q("s6"),
    ],
    questions: [
      {
        id: "s5",
        order: 5,
        prompt: "How can cities encourage people to use public spaces?",
        config: { part: 3, preparationSec: 0, responseSec: 60 },
        points: 0,
      },
      {
        id: "s6",
        order: 6,
        prompt:
          "Do you think technology will make public spaces better or worse in the future?",
        config: { part: 3, preparationSec: 0, responseSec: 60 },
        points: 0,
      },
    ],
  },
];

async function main(tx: Prisma.TransactionClient) {
  console.log("Seeding development IELTS test...");

  // Remove only this development test. It is intentionally tenant-agnostic.
  await tx.test.deleteMany({
    where: { id: testId },
  });

  await tx.test.create({
    data: {
      id: testId,
      title: "IELTS Academic Development Test — All Question Types",
      version: "development-v1",
      isPublished: true,

      sections: {
        create: [
          {
            id: ids.listening,
            skill: TestSkill.LISTENING,
            order: 1,
            durationSec: 30 * 60,
            instructions:
              "Listen carefully and answer Questions 1-24. You will hear each recording once.",
            audioTracks: {
              create: audioTracks,
            },
          },
          {
            id: ids.reading,
            skill: TestSkill.READING,
            order: 2,
            durationSec: 60 * 60,
            instructions: "Read the passages and answer Questions 1-43.",
            passages: {
              create: readingPassages,
            },
          },
          {
            id: ids.writing,
            skill: TestSkill.WRITING,
            order: 3,
            durationSec: 60 * 60,
            instructions: "Complete both writing tasks.",
          },
          {
            id: ids.speaking,
            skill: TestSkill.SPEAKING,
            order: 4,
            durationSec: 14 * 60,
            instructions: "Complete all three parts of the speaking test.",
          },
        ],
      },
    },
  });

  // Groups are created separately because their layouts contain deterministic
  // Question IDs. This also makes the seed much easier to extend.
  for (const group of groups) {
    await tx.questionGroup.create({
      data: {
        id: group.id,
        sectionId: group.sectionId,
        passageId: group.passageId,
        audioTrackId: group.audioTrackId,
        type: group.type,
        order: group.order,
        title: group.title,
        instructions: group.instructions,
        layout: group.layout,
        questions: {
          create: group.questions.map((question) => ({
            id: question.id,
            order: question.order,
            prompt: question.prompt,
            config: question.config,
            correctAnswer: question.correctAnswer,
            points: question.points ?? 1,
          })),
        },
      },
    });
  }

  console.log(`Created test: ${testId}`);
  console.log(`Question groups: ${groups.length}`);
  console.log(
    `Questions: ${groups.reduce((total, group) => total + group.questions.length, 0)}`,
  );

  const byType = groups.reduce<Record<string, number>>((acc, group) => {
    acc[group.type] = (acc[group.type] ?? 0) + group.questions.length;
    return acc;
  }, {});

  console.table(byType);
}

// prisma/seed.ts
//
// Seeds one complete 40-question IELTS Listening mock test that exercises
// every listening-relevant QuestionType in the schema:
//   FORM_COMPLETION, TABLE_COMPLETION, MULTIPLE_CHOICE,
//   MULTIPLE_CHOICE_MULTI_ANSWER, DIAGRAM_LABELLING, MATCHING_FEATURES,
//   SHORT_ANSWER, SENTENCE_COMPLETION, NOTE_COMPLETION,
//   FLOW_CHART_COMPLETION, SUMMARY_COMPLETION
// (TRUE_FALSE_NOT_GIVEN, YES_NO_NOT_GIVEN, MATCHING_HEADING and
// MATCHING_INFORMATION are Reading-only types, so they're not part of a
// Listening test and are skipped here.)
//
// Idempotent: every row uses a fixed id, so re-running `prisma db seed`
// during development just upserts instead of duplicating.
//
// ADJUST THIS IMPORT to match where your `output` path from the
// `generator client` block actually resolves relative to this file.

// ADJUST THIS IMPORT to wherever you put content-blocks.schema.ts.
import {
  ContentBlock,
  ContentBlockArray,
  InlineNode,
  QuestionConfigByType,
  QuestionCorrectAnswerByType,
  IeltsQuestionType,
} from "../../contents/content-blocks.schema";

// -----------------------------------------------------------------------
// Fixed ids
// -----------------------------------------------------------------------
const TENANT_ID = "seed-dev-tenant";
const TEST_ID = "seed-lt-test";
const SECTION_ID = "seed-lt-section";
const AUDIO = {
  p1: "seed-lt-audio-1",
  p2: "seed-lt-audio-2",
  p3: "seed-lt-audio-3",
  p4: "seed-lt-audio-4",
};
const EXAM_ID = "seed-dev-exam";
const SEAT_ID = "seed-dev-seat";

const qid = (n: number) => `seed-lt-q${n}`;

// -----------------------------------------------------------------------
// Small helpers
// -----------------------------------------------------------------------
type Q = {
  id: string;
  order: number;
  prompt?: string;
  config: unknown;
  correctAnswer: unknown;
};

function collectQuestionIdsFromLayout(blocks: ContentBlock[]): string[] {
  const ids: string[] = [];
  const visitInline = (nodes: InlineNode[]) =>
    nodes.forEach((n) => n.kind === "blank" && ids.push(n.questionId));

  for (const b of blocks) {
    if (b.kind === "paragraph") visitInline(b.content);
    if (b.kind === "list") b.items.forEach(visitInline);
    if (b.kind === "question") ids.push(b.questionId);
    if (b.kind === "table")
      b.rows
        .flat()
        .forEach((c) => c.kind === "blank" && ids.push(c.questionId));
    if (b.kind === "image") b.hotspots?.forEach((h) => ids.push(h.questionId));
    if (b.kind === "flow-chart") b.nodes.forEach((n) => visitInline(n));
  }
  return ids;
}

async function seedGroup(
  tx: Prisma.TransactionClient,
  g: {
    id: string;
    audioTrackId: string;
    type: keyof typeof QuestionType;
    order: number;
    title: string;
    instructions: string;
    layout: ContentBlock[];
    questions: Q[];
  },
) {
  // Validate the layout shape itself.
  ContentBlockArray.parse(g.layout);

  // Validate every question's config/correctAnswer against the contract
  // for this group's type.
  const configSchema = QuestionConfigByType[g.type as IeltsQuestionType];
  const answerSchema = QuestionCorrectAnswerByType[g.type as IeltsQuestionType];
  for (const q of g.questions) {
    configSchema.parse(q.config);
    answerSchema.parse(q.correctAnswer);
  }

  // Cross-check: every blank/question reference inside the layout must
  // point at a question that actually exists in this group, and vice
  // versa. Groups that don't embed blanks in their layout (e.g. Matching
  // Features, Short Answer — they render straight from Question.prompt)
  // are skipped, since layoutQuestionIds is legitimately empty for them.
  const layoutIds = collectQuestionIdsFromLayout(g.layout).sort();
  const groupIds = g.questions.map((q) => q.id).sort();
  if (
    layoutIds.length > 0 &&
    JSON.stringify(layoutIds) !== JSON.stringify(groupIds)
  ) {
    throw new Error(
      `Group ${g.id}: layout references [${layoutIds}] but questions are [${groupIds}]`,
    );
  }

  await tx.questionGroup.upsert({
    where: { id: g.id },
    create: {
      id: g.id,
      sectionId: SECTION_ID,
      audioTrackId: g.audioTrackId,
      type: QuestionType[g.type],
      order: g.order,
      title: g.title,
      instructions: g.instructions,
      layout: g.layout as any,
    },
    update: {
      type: QuestionType[g.type],
      order: g.order,
      title: g.title,
      instructions: g.instructions,
      layout: g.layout as any,
    },
  });

  for (const q of g.questions) {
    await tx.question.upsert({
      where: { id: q.id },
      create: {
        id: q.id,
        questionGroupId: g.id,
        order: q.order,
        prompt: q.prompt ?? null,
        config: q.config as any,
        correctAnswer: q.correctAnswer as any,
      },
      update: {
        order: q.order,
        prompt: q.prompt ?? null,
        config: q.config as any,
        correctAnswer: q.correctAnswer as any,
      },
    });

    await tx.answerKey.upsert({
      where: { id: `${q.id}-ak` },
      create: {
        id: `${q.id}-ak`,
        testId: TEST_ID,
        sectionId: SECTION_ID,
        questionId: q.id,
        answer: q.correctAnswer as any,
      },
      update: { answer: q.correctAnswer as any },
    });
  }

  console.log(
    `  seeded group ${g.order}: ${g.title} (${g.questions.length} questions)`,
  );
}

// =========================================================================
async function main2(tx: Prisma.TransactionClient) {
  await tx.tenant.upsert({
    where: { id: TENANT_ID },
    create: {
      id: TENANT_ID,
      name: "Dev Test Center",
      subdomain: "dev",
      seatQuota: 100,
    },
    update: {},
  });

  await tx.test.upsert({
    where: { id: TEST_ID },
    create: {
      id: TEST_ID,
      title: "Seed Mock Test 1 — Listening",
      version: "seed-v1",
      isPublished: true,
    },
    update: { isPublished: true },
  });

  await tx.section.upsert({
    where: { id: SECTION_ID },
    create: {
      id: SECTION_ID,
      testId: TEST_ID,
      skill: TestSkill.LISTENING,
      order: 1,
      durationSec: 2040, // 34 minutes, no separate transfer time (computer-delivered)
      instructions:
        "You will hear a number of different recordings and you will have to answer questions on what you hear. There will be time for you to read the instructions and questions. Each recording is played once only.",
    },
    update: {},
  });

  // Transcripts are optional (admin/QA use only) and omitted here for
  // brevity — add them later via your content-review tooling if needed.
  const audioTracks = [
    {
      id: AUDIO.p1,
      order: 1,
      title: "Part 1 — Membership enquiry call",
      audioUrl: "https://placeholder.ielts-mock.dev/audio/part1.mp3",
    },
    {
      id: AUDIO.p2,
      order: 2,
      title: "Part 2 — Leisure centre facilities tour",
      audioUrl: "https://placeholder.ielts-mock.dev/audio/part2.mp3",
    },
    {
      id: AUDIO.p3,
      order: 3,
      title: "Part 3 — Renewable energy project discussion",
      audioUrl: "https://placeholder.ielts-mock.dev/audio/part3.mp3",
    },
    {
      id: AUDIO.p4,
      order: 4,
      title: "Part 4 — Lecture: Urban Pollinator Corridors",
      audioUrl: "https://placeholder.ielts-mock.dev/audio/part4.mp3",
    },
  ];
  for (const t of audioTracks) {
    await tx.audioTrack.upsert({
      where: { id: t.id },
      create: { ...t, sectionId: SECTION_ID },
      update: t,
    });
  }

  console.log("Seeding question groups...");

  // ======================= SECTION 1 (Q1–10) =============================
  await seedGroup(tx, {
    id: "seed-lt-g1",
    audioTrackId: AUDIO.p1,
    type: "FORM_COMPLETION",
    order: 1,
    title: "Membership Application",
    instructions:
      "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
    layout: [
      { kind: "heading", text: "Questions 1–5" },
      { kind: "subheading", text: "Personal Details" },
      { kind: "question", questionId: qid(1), label: "Full name" },
      { kind: "question", questionId: qid(2), label: "Contact number" },
      { kind: "question", questionId: qid(3), label: "Home town" },
      { kind: "subheading", text: "Membership Details" },
      { kind: "question", questionId: qid(4), label: "Membership type" },
      { kind: "question", questionId: qid(5), label: "Start date" },
    ],
    questions: [
      {
        id: qid(1),
        order: 1,
        config: { maxWords: 3 },
        correctAnswer: "Sarah Kensington",
      },
      {
        id: qid(2),
        order: 2,
        config: { maxWords: 3 },
        correctAnswer: "07911 645302",
      },
      {
        id: qid(3),
        order: 3,
        config: { maxWords: 2 },
        correctAnswer: "Manchester",
      },
      {
        id: qid(4),
        order: 4,
        config: { maxWords: 2 },
        correctAnswer: "Family",
      },
      {
        id: qid(5),
        order: 5,
        config: { maxWords: 3 },
        correctAnswer: "14 March",
      },
    ],
  });

  await seedGroup(tx, {
    id: "seed-lt-g2",
    audioTrackId: AUDIO.p1,
    type: "TABLE_COMPLETION",
    order: 2,
    title: "Membership Fees",
    instructions:
      "Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
    layout: [
      { kind: "heading", text: "Questions 6–10" },
      {
        kind: "table",
        caption: "Membership Fees",
        columns: ["Membership type", "Monthly price", "Includes"],
        rows: [
          [
            { kind: "text", text: "Standard" },
            { kind: "blank", questionId: qid(6) },
            { kind: "text", text: "Gym and pool" },
          ],
          [
            { kind: "text", text: "Off-peak" },
            { kind: "text", text: "£25" },
            { kind: "blank", questionId: qid(7) },
          ],
          [
            { kind: "blank", questionId: qid(8) },
            { kind: "text", text: "£45" },
            { kind: "text", text: "Gym, pool and classes" },
          ],
          [
            { kind: "text", text: "Student" },
            { kind: "blank", questionId: qid(9) },
            { kind: "blank", questionId: qid(10) },
          ],
        ],
      },
    ],
    questions: [
      { id: qid(6), order: 6, config: { maxWords: 2 }, correctAnswer: "£35" },
      {
        id: qid(7),
        order: 7,
        config: { maxWords: 2 },
        correctAnswer: "Pool only",
      },
      {
        id: qid(8),
        order: 8,
        config: { maxWords: 2 },
        correctAnswer: "Premium",
      },
      { id: qid(9), order: 9, config: { maxWords: 2 }, correctAnswer: "£20" },
      {
        id: qid(10),
        order: 10,
        config: { maxWords: 2 },
        correctAnswer: "Gym and pool",
      },
    ],
  });

  // ======================= SECTION 2 (Q11–20) MULTIPLE_CHOICE ============================
  await seedGroup(tx, {
    id: "seed-lt-g3",
    audioTrackId: AUDIO.p2,
    type: "MULTIPLE_CHOICE",
    order: 3,
    title: "Facilities Overview",
    instructions: "Choose the correct letter, A, B or C.",
    layout: [
      { kind: "heading", text: "Questions 11–13" },
      { kind: "question", questionId: qid(11) },
      { kind: "question", questionId: qid(12) },
      { kind: "question", questionId: qid(13) },
    ],
    questions: [
      {
        id: qid(11),
        order: 11,
        prompt: "The swimming pool is closed for maintenance every",
        config: {
          options: [
            { label: "A", text: "Monday morning" },
            { label: "B", text: "Wednesday evening" },
            { label: "C", text: "Friday afternoon" },
          ],
        },
        correctAnswer: "B",
      },
      {
        id: qid(12),
        order: 12,
        prompt: "Free parking is available to members who",
        config: {
          options: [
            { label: "A", text: "arrive before 9 a.m." },
            { label: "B", text: "stay for over two hours" },
            { label: "C", text: "book a class in advance" },
          ],
        },
        correctAnswer: "C",
      },
      {
        id: qid(13),
        order: 13,
        prompt: "The café's most popular item is the",
        config: {
          options: [
            { label: "A", text: "vegetable soup" },
            { label: "B", text: "chicken wrap" },
            { label: "C", text: "fruit smoothie" },
          ],
        },
        correctAnswer: "C",
      },
    ],
  });

  // MULTIPLE_CHOICE_MULTI_ANSWER
  await seedGroup(tx, {
    id: "seed-lt-g4",
    audioTrackId: AUDIO.p2,
    type: "MULTIPLE_CHOICE_MULTI_ANSWER",
    order: 4,
    title: "Recent Renovations",
    instructions:
      "Choose TWO letters, A–E. Which TWO facilities were added during the recent renovation?",
    layout: [
      { kind: "heading", text: "Questions 14 and 15" },
      { kind: "question", questionId: qid(14) },
    ],
    // Two rows share one correct set: grading logic should check the pair
    // of submitted letters against {"B","D"} as a set, not order or index.
    questions: (["A"] as const).map((_, i) => ({
      id: qid(14 + i),
      order: 14 + i,
      config: {
        options: [
          { label: "A", text: "Sauna" },
          { label: "B", text: "Climbing wall" },
          { label: "C", text: "Running track" },
          { label: "D", text: "Yoga studio" },
          { label: "E", text: "Juice bar" },
        ],
        selectCount: 2,
        displayRange: "14-15",
      },
      correctAnswer: ["B", "D"],
    })),
  });

  // DIAGRAM_LABELLING
  await seedGroup(tx, {
    id: "seed-lt-g5",
    audioTrackId: AUDIO.p2,
    type: "DIAGRAM_LABELLING",
    order: 5,
    title: "Leisure Centre Floor Plan",
    instructions:
      "Label the floor plan below. Write ONE WORD ONLY for each answer.",
    layout: [
      { kind: "heading", text: "Questions 16–20" },
      {
        kind: "list",
        items: [
          [{ kind: "text", text: "A   Café" }],
          [{ kind: "text", text: "B   Gallery" }],
          [{ kind: "text", text: "C   Main Hall" }],
          [{ kind: "text", text: "D   Reception" }],
          [{ kind: "text", text: "E   Recording Studio" }],
          [{ kind: "text", text: "F   Shop" }],
          [{ kind: "text", text: "G   Workshop" }],
        ],
      },
      {
        kind: "image",
        url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.ielts-writing.info%2Fimages%2Fgraphs%2FIELTS_Writing_Task_1_Map_A-176.png&f=1&nofb=1&ipt=40aa79e3dab657d6e4edf53203fdb5d01a7bea20b4eae255a2fd1aa7d60824bb",
        alt: "Floor plan of Riverside Leisure Centre",
        hotspots: [
          { questionId: qid(16), x: 20, y: 15, markerLabel: "16" },
          { questionId: qid(17), x: 55, y: 20, markerLabel: "17" },
          { questionId: qid(18), x: 75, y: 40, markerLabel: "18" },
          { questionId: qid(19), x: 30, y: 70, markerLabel: "19" },
          { questionId: qid(20), x: 65, y: 80, markerLabel: "20" },
        ],
      },
    ],
    questions: [
      {
        id: qid(16),
        order: 16,
        config: { maxWords: 1, options: ["A", "B", "C", "D", "E", "F", "G"] },
        correctAnswer: "Reception",
      },
      {
        id: qid(17),
        order: 17,
        config: { maxWords: 1, options: ["A", "B", "C", "D", "E", "F", "G"] },
        correctAnswer: "Changing rooms",
      },
      {
        id: qid(18),
        order: 18,
        config: { maxWords: 1, options: ["A", "B", "C", "D", "E", "F", "G"] },
        correctAnswer: "Sauna",
      },
      {
        id: qid(19),
        order: 19,
        config: { maxWords: 1, options: ["A", "B", "C", "D", "E", "F", "G"] },
        correctAnswer: "Studio 2",
      },
      {
        id: qid(20),
        order: 20,
        config: { maxWords: 1, options: ["A", "B", "C", "D", "E", "F", "G"] },
        correctAnswer: "Café",
      },
    ],
  });

  // ======================= SECTION 3 (Q21–30) ============================
  // MATCHING_FEATURES 21-24
  await seedGroup(tx, {
    id: "seed-lt-g6",
    audioTrackId: AUDIO.p3,
    type: "MATCHING_FEATURES",
    order: 6,
    title: "Project Roles and Opinions",
    instructions:
      "What does each speaker say about the renewable energy project? Choose the correct answer, A, B or C, for Questions 21–24.",
    layout: [
      { kind: "heading", text: "Questions 21–24" },
      {
        kind: "list",
        items: [
          [{ kind: "text", text: "A  Anna" }],
          [{ kind: "text", text: "B  Marcus" }],
          [{ kind: "text", text: "C  The tutor" }],
        ],
      },
      {
        kind: "question",
        questionId: qid(21),
      },
      {
        kind: "question",
        questionId: qid(22),
      },
      {
        kind: "question",
        questionId: qid(23),
      },
      {
        kind: "question",
        questionId: qid(24),
      },
    ],
    questions: [
      {
        id: qid(21),
        order: 21,
        prompt: "thinks the submission deadline should be extended",
        config: { options: ["A", "B", "C"] },
        correctAnswer: "B",
      },
      {
        id: qid(22),
        order: 22,
        prompt: "recommends prioritising solar data over wind data",
        config: { options: ["A", "B", "C"] },
        correctAnswer: "A",
      },
      {
        id: qid(23),
        order: 23,
        prompt: "points out a weakness in the survey method",
        config: { options: ["A", "B", "C"] },
        correctAnswer: "C",
      },
      {
        id: qid(24),
        order: 24,
        prompt: "offers to lend equipment from an earlier project",
        config: { options: ["A", "B", "C"] },
        correctAnswer: "B",
      },
    ],
  });

  // SHORT_ANSWER 25-27
  await seedGroup(tx, {
    id: "seed-lt-g7",
    audioTrackId: AUDIO.p3,
    type: "SHORT_ANSWER",
    order: 7,
    title: "Project Logistics",
    instructions:
      "Answer the questions below. Write NO MORE THAN THREE WORDS for each answer.",
    layout: [
      { kind: "heading", text: "Questions 25–27" },
      {
        kind: "question",
        questionId: qid(25),
      },
      {
        kind: "question",
        questionId: qid(26),
      },
      {
        kind: "question",
        questionId: qid(27),
      },
    ],
    questions: [
      {
        id: qid(25),
        order: 25,
        prompt: "What instrument will the students use to record wind speed?",
        config: { maxWords: 3 },
        correctAnswer: "an anemometer",
      },
      {
        id: qid(26),
        order: 26,
        prompt: "Which building will house the sensor equipment?",
        config: { maxWords: 3 },
        correctAnswer: "the engineering block",
      },
      {
        id: qid(27),
        order: 27,
        prompt: "What software will the students use to analyse their data?",
        config: { maxWords: 3 },
        correctAnswer: "MATLAB",
      },
    ],
  });

  // SENTENCE_COMPLETION 28-30
  await seedGroup(tx, {
    id: "seed-lt-g8",
    audioTrackId: AUDIO.p3,
    type: "SENTENCE_COMPLETION",
    order: 8,
    title: "Project Deadlines",
    instructions:
      "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
    layout: [
      { kind: "heading", text: "Questions 28–30" },
      {
        kind: "paragraph",
        content: [
          { kind: "text", text: "The project must be finished before the " },
          { kind: "blank", questionId: qid(28) },
          { kind: "text", text: "." },
        ],
      },
      {
        kind: "paragraph",
        content: [
          { kind: "text", text: "Anna will be mainly responsible for " },
          { kind: "blank", questionId: qid(29) },
          { kind: "text", text: "." },
        ],
      },
      {
        kind: "paragraph",
        content: [
          {
            kind: "text",
            text: "The final report needs to be submitted as a ",
          },
          { kind: "blank", questionId: qid(30) },
          { kind: "text", text: " file." },
        ],
      },
    ],
    questions: [
      {
        id: qid(28),
        order: 28,
        config: { maxWords: 2 },
        correctAnswer: "end of term",
      },
      {
        id: qid(29),
        order: 29,
        config: { maxWords: 2 },
        correctAnswer: "data collection",
      },
      { id: qid(30), order: 30, config: { maxWords: 1 }, correctAnswer: "PDF" },
    ],
  });

  // ======================= SECTION 4 (Q31–40) ============================
  // NOTE_COMPLETION 31-33
  await seedGroup(tx, {
    id: "seed-lt-g9",
    audioTrackId: AUDIO.p4,
    type: "NOTE_COMPLETION",
    order: 9,
    title: "Lecture Notes: Background",
    instructions:
      "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.",
    layout: [
      { kind: "heading", text: "Questions 31–33" },
      { kind: "subheading", text: "Background" },
      {
        kind: "list",
        items: [
          [
            { kind: "text", text: "First proposed in the " },
            { kind: "blank", questionId: qid(31) },
            { kind: "text", text: "." },
          ],
          [
            {
              kind: "text",
              text: "Main aim: connect isolated green spaces across a city",
            },
          ],
        ],
      },
      { kind: "subheading", text: "Design Principles" },
      {
        kind: "list",
        items: [
          [
            { kind: "text", text: "Corridors should be at least " },
            { kind: "blank", questionId: qid(32) },
            { kind: "text", text: " wide." },
          ],
          [
            { kind: "text", text: "Native " },
            { kind: "blank", questionId: qid(33) },
            { kind: "text", text: " are preferred to ornamental varieties." },
          ],
        ],
      },
    ],
    questions: [
      {
        id: qid(31),
        order: 31,
        config: { maxWords: 1 },
        correctAnswer: "1990s",
      },
      {
        id: qid(32),
        order: 32,
        config: { maxWords: 2 },
        correctAnswer: "5 metres",
      },
      {
        id: qid(33),
        order: 33,
        config: { maxWords: 1 },
        correctAnswer: "wildflowers",
      },
    ],
  });

  // FLOW_CHART_COMPLETION 34-37
  await seedGroup(tx, {
    id: "seed-lt-g10",
    audioTrackId: AUDIO.p4,
    type: "FLOW_CHART_COMPLETION",
    order: 10,
    title: "Establishing a Corridor",
    instructions:
      "Complete the flow chart below. Write NO MORE THAN TWO WORDS for each answer.",
    layout: [
      { kind: "heading", text: "Questions 34-37" },
      {
        kind: "flow-chart",
        nodes: [
          [{ kind: "text", text: "Choose research topic" }],

          [
            { kind: "text", text: "Conduct " },
            { kind: "blank", questionId: qid(34) },
          ],
          [
            { kind: "text", text: "Prepare first " },
            { kind: "blank", questionId: qid(35) },
          ],

          [
            { kind: "text", text: "Receive feedback from " },
            { kind: "blank", questionId: qid(36) },
          ],
          [
            { kind: "text", text: "Submit final " },
            { kind: "blank", questionId: qid(37) },
          ],
        ],
      },
    ],
    questions: [
      {
        id: qid(34),
        order: 34,
        config: { maxWords: 2 },
        correctAnswer: "local residents",
      },
      {
        id: qid(35),
        order: 35,
        config: { maxWords: 2 },
        correctAnswer: "Landscape architects",
      },
      {
        id: qid(36),
        order: 36,
        config: { maxWords: 1 },
        correctAnswer: "autumn",
      },
      {
        id: qid(37),
        order: 37,
        config: { maxWords: 2 },
        correctAnswer: "pollinator activity",
      },
    ],
  });

  const wordBank = [
    "temperature",
    "humidity",
    "canopy",
    "corridor",
    "pollution",
    "nectar",
  ];

  // SUMMARY_COMPLETION 38-40
  await seedGroup(tx, {
    id: "seed-lt-g11",
    audioTrackId: AUDIO.p4,
    type: "SUMMARY_COMPLETION",
    order: 11,
    title: "Research Findings Summary",
    instructions:
      "Complete the summary below. Choose NO MORE THAN ONE WORD from the box for each answer.",
    layout: [
      { kind: "heading", text: "Questions 38–40" },
      {
        kind: "list",
        items: wordBank.map((w) => [{ kind: "text", text: w } as InlineNode]),
      },
      {
        kind: "paragraph",
        content: [
          {
            kind: "text",
            text: "Corridors rich in flowering plants attracted the greatest number of bees, largely due to increased ",
          },
          { kind: "blank", questionId: qid(38) },
          {
            kind: "text",
            text: " production. They also helped reduce local ",
          },
          { kind: "blank", questionId: qid(39) },
          {
            kind: "text",
            text: ", since larger corridors created more shade. Future monitoring will track ",
          },
          { kind: "blank", questionId: qid(40) },
          { kind: "text", text: " levels near busy roads." },
        ],
      },
    ],
    questions: [
      {
        id: qid(38),
        order: 38,
        config: { maxWords: 1, wordBank },
        correctAnswer: "nectar",
      },
      {
        id: qid(39),
        order: 39,
        config: { maxWords: 1, wordBank },
        correctAnswer: "temperature",
      },
      {
        id: qid(40),
        order: 40,
        config: { maxWords: 1, wordBank },
        correctAnswer: "pollution",
      },
    ],
  });

  // =============== OPTIONAL: dev tenant/exam/seat for manual testing ======
  // Lets you log in as a candidate against this test immediately without
  // building the exam-scheduling flow first. Delete this block if you'd
  // rather seed content only.
  await tx.exam.upsert({
    where: { id: EXAM_ID },
    create: {
      id: EXAM_ID,
      tenantId: TENANT_ID,
      testId: TEST_ID,
      examDate: new Date(),
      status: ExamStatus.SCHEDULED,
    },
    update: {},
  });

  await tx.examSeat.upsert({
    where: { id: SEAT_ID },
    create: {
      id: SEAT_ID,
      tenantId: TENANT_ID,
      examId: EXAM_ID,
      accessCode: "DEV-CODE-001",
      candidateName: "Test Candidate",
      candidateId: "DEV001",
      candidateContact: "dev@example.com",
      status: ExamSeatStatus.NOT_STARTED,
    },
    update: {},
  });

  console.log("\nDone. Dev candidate access code: DEV-CODE-001");
}

// main()
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

export const bootstrap = async (req: Request, res: Response) => {
  debug("Bootstrap endpoint called", req);
  const result = await db.$transaction(async (tx) => {
    const createdDataPromises = tenants.map((tenant) => {
      return tx.tenant
        .upsert({
          where: { subdomain: tenant.subdomain },
          create: {
            subdomain: tenant.subdomain,
            name: tenant.name,
            seatQuota: tenant.seatQuota,
          },
          update: {
            name: tenant.name,
            subdomain: tenant.subdomain,
            seatQuota: tenant.seatQuota,
          },
        })
        .then(async (result) => {
          await tx.tenantSeatUsage.upsert({
            where: { tenantId: result.id },
            create: {
              tenantId: result.id,
              usedSeats: 0,
            },
            update: {},
          });
          const users = tenant.users;
          const usersPromises = users.map((user) => {
            const hashedPassword = bcrypt.hashSync(user.password, 10);
            return tx.user.upsert({
              where: { email: user.email },
              create: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                tenantId: result.id,
                roles: user.roles,
              },
              update: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                tenantId: result.id,
                roles: user.roles,
              },
            });
          });
          const results = await Promise.all(usersPromises);
          return { tenant: result, users: results };
        });
    });
    const res = await Promise.all(createdDataPromises);
    // await main(tx);
    await main2(tx);
    return res;
  });

  return res.status(201).json({ message: "Bootstrap successful", result });
};
