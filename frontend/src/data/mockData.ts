import type {
  Tenant,
  Student,
  TestResult,
  SeatReservation,
  TestSection,
  ScheduledTest,
  TestSubmission,
} from "../app/types";

// Mock tenants
export const mockTenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "Global English Academy",
    location: "London, UK",
    totalSeats: 30,
    agreement: "Standard Package",
    pricePerTest: 45.0,
    testAttempts: {
      total: 100,
      used: 15,
      remaining: 85,
    },
  },
  {
    id: "tenant-2",
    name: "Prestige Language Center",
    location: "Manchester, UK",
    totalSeats: 20,
    agreement: "Premium Package",
    pricePerTest: 55.0,
    testAttempts: {
      total: 50,
      used: 5,
      remaining: 45,
    },
  },
];

// Mock students
export const mockStudents: Student[] = [
  {
    id: "student-1",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    tenantId: "tenant-1",
    accessCode: "IELTS-2026-001",
    assignedSeat: 1,
    testStatus: "completed",
    testDate: "2026-01-01",
  },
  {
    id: "student-2",
    name: "Bob Smith",
    email: "bob.smith@email.com",
    tenantId: "tenant-1",
    accessCode: "IELTS-2026-002",
    assignedSeat: 2,
    testStatus: "in-progress",
    testDate: "2026-01-01",
  },
  {
    id: "student-3",
    name: "Carol White",
    email: "carol.white@email.com",
    tenantId: "tenant-1",
    testStatus: "pending",
    testDate: "2026-01-02",
  },
  {
    id: "student-4",
    name: "David Brown",
    email: "david.brown@email.com",
    tenantId: "tenant-1",
    accessCode: "IELTS-2026-003",
    assignedSeat: 3,
    testStatus: "pending",
    testDate: "2026-01-01",
  },
];

// Mock test results
export const mockTestResults: TestResult[] = [
  {
    id: "result-1",
    studentId: "student-1",
    tenantId: "tenant-1",
    testDate: "2026-01-01",
    sections: {
      listening: 8.0,
      reading: 7.5,
      writing: 7.0,
      speaking: 8.5,
    },
    overallScore: 7.75,
    completionTime: 165,
  },
];

// Mock seat reservations
export const mockReservations: SeatReservation[] = [
  {
    id: "res-1",
    tenantId: "tenant-1",
    seatNumber: 1,
    studentId: "student-1",
    studentName: "Alice Johnson",
    accessCode: "IELTS-2026-001",
    date: "2026-01-01",
    status: "completed",
  },
  {
    id: "res-2",
    tenantId: "tenant-1",
    seatNumber: 2,
    studentId: "student-2",
    studentName: "Bob Smith",
    accessCode: "IELTS-2026-002",
    date: "2026-01-01",
    status: "active",
  },
  {
    id: "res-3",
    tenantId: "tenant-1",
    seatNumber: 3,
    studentId: "student-4",
    studentName: "David Brown",
    accessCode: "IELTS-2026-003",
    date: "2026-01-01",
    status: "reserved",
  },
];

// Mock reading test section
export const mockReadingSection: TestSection = {
  id: "reading-1",
  name: "Academic Reading",
  duration: 60,
  passage: `The History of the Bicycle

The bicycle, as we know it today, is a relatively modern invention. The first verifiable claim for a practical bicycle belongs to Baron Karl von Drais, a German civil servant, who invented his Laufmaschine (running machine) in 1817. This early bicycle was propelled by pushing feet against the ground, and it featured a steerable front wheel. Von Drais' invention was the foundation for what would become one of the most important forms of transportation in history.

The evolution of the bicycle throughout the 19th century was marked by several significant innovations. In the 1860s, French inventors Pierre Michaux and Pierre Lallement added pedals to the front wheel, creating the velocipede, commonly known as the "bone shaker" due to its uncomfortable wooden wheels and iron frame. This design was revolutionary at the time, as it allowed riders to propel themselves without touching the ground.

The 1870s saw the introduction of the penny-farthing, or high-wheel bicycle, which featured a large front wheel and a much smaller rear wheel. The large wheel allowed for greater speeds, as each rotation of the pedals moved the bicycle further. However, this design was dangerous, with riders perched high above the ground and at risk of "taking a header" over the front wheel during sudden stops.

The safety bicycle, introduced in the 1880s, revolutionized cycling by featuring two wheels of equal size and a chain-driven rear wheel. This design, along with the invention of pneumatic tires by John Boyd Dunlop in 1888, made cycling comfortable and accessible to the masses. The safety bicycle's design remains the basic template for bicycles manufactured today.

The bicycle's impact on society has been profound. It played a crucial role in the women's rights movement of the late 19th century, providing women with unprecedented mobility and independence. Susan B. Anthony declared in 1896 that the bicycle had "done more to emancipate women than anything else in the world." The bicycle also spurred the development of better roads and was a precursor to the automobile industry, with many early car manufacturers, including Henry Ford, beginning their careers in the bicycle business.`,
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "Who invented the first practical bicycle?",
      options: [
        "Pierre Michaux",
        "Baron Karl von Drais",
        "Pierre Lallement",
        "John Boyd Dunlop",
      ],
      correctAnswer: "Baron Karl von Drais",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "What was the velocipede commonly known as?",
      options: [
        "The running machine",
        "The bone shaker",
        "The penny-farthing",
        "The safety bicycle",
      ],
      correctAnswer: "The bone shaker",
    },
    {
      id: "q3",
      type: "true-false-not-given",
      question: "The penny-farthing was safer than the safety bicycle.",
      correctAnswer: "FALSE",
    },
    {
      id: "q4",
      type: "true-false-not-given",
      question: "John Boyd Dunlop invented pneumatic tires in 1888.",
      correctAnswer: "TRUE",
    },
    {
      id: "q5",
      type: "fill-blank",
      question:
        "Susan B. Anthony stated that the bicycle had done more to emancipate _____ than anything else.",
      correctAnswer: "women",
    },
    {
      id: "q6",
      type: "multiple-choice",
      question:
        "Which innovation made cycling comfortable and accessible to the masses?",
      options: [
        "The velocipede",
        "Pneumatic tires",
        "The penny-farthing",
        "The Laufmaschine",
      ],
      correctAnswer: "Pneumatic tires",
    },
    {
      id: "q7",
      type: "true-false-not-given",
      question: "Henry Ford began his career in the bicycle business.",
      correctAnswer: "NOT GIVEN",
    },
    {
      id: "q8",
      type: "fill-blank",
      question: "The safety bicycle featured two wheels of _____ size.",
      correctAnswer: "equal",
    },
  ],
};

// Mock listening section
export const mockListeningSection: TestSection = {
  id: "listening-1",
  name: "Listening Test",
  duration: 30,
  audioUrl: "mock-audio.mp3",
  questions: [
    {
      id: "l1",
      type: "multiple-choice",
      question: "What is the main topic of the conversation?",
      options: [
        "University accommodation",
        "Course registration",
        "Library services",
        "Student visa",
      ],
      correctAnswer: "University accommodation",
    },
    {
      id: "l2",
      type: "fill-blank",
      question: "The deposit for the accommodation is £_____.",
      correctAnswer: "300",
    },
    {
      id: "l3",
      type: "multiple-choice",
      question: "When does the student need to move in?",
      options: ["Next Monday", "This Friday", "Next week", "Tomorrow"],
      correctAnswer: "This Friday",
    },
    {
      id: "l4",
      type: "fill-blank",
      question: "The accommodation office is located on the _____ floor.",
      correctAnswer: "second",
    },
  ],
};

// Mock writing section
export const mockWritingSection: TestSection = {
  id: "writing-1",
  name: "Writing Task",
  duration: 60,
  questions: [
    {
      id: "w1",
      type: "text",
      question:
        "Task 1: The chart below shows the number of students enrolled in different courses at a university. Summarize the information by selecting and reporting the main features. Write at least 150 words.",
      correctAnswer: "", // Essay question
    },
    {
      id: "w2",
      type: "text",
      question:
        "Task 2: Some people believe that technology has made our lives more complex. Others think it has made life easier. Discuss both views and give your opinion. Write at least 250 words.",
      correctAnswer: "", // Essay question
    },
  ],
};

// Mock scheduled tests
export const mockScheduledTests: ScheduledTest[] = [
  {
    id: "scheduled-1",
    tenantId: "tenant-1",
    testDate: "2026-01-10",
    students: [
      {
        id: "student-1",
        name: "Alice Johnson",
        email: "alice.johnson@email.com",
        accessCode: "IELTS-2026-010",
        assignedSeat: 1,
      },
      {
        id: "student-2",
        name: "Bob Smith",
        email: "bob.smith@email.com",
        accessCode: "IELTS-2026-011",
        assignedSeat: 2,
      },
    ],
    attemptsAllocated: 2,
    status: "scheduled",
  },
  {
    id: "scheduled-2",
    tenantId: "tenant-1",
    testDate: "2026-01-15",
    students: [
      {
        id: "student-3",
        name: "Carol White",
        email: "carol.white@email.com",
        accessCode: "IELTS-2026-015",
      },
      {
        id: "student-4",
        name: "David Brown",
        email: "david.brown@email.com",
        accessCode: "IELTS-2026-016",
      },
      {
        id: "student-5",
        name: "Emma Davis",
        email: "emma.davis@email.com",
        accessCode: "IELTS-2026-017",
      },
    ],
    attemptsAllocated: 3,
    status: "scheduled",
  },
];

// Mock test submissions
export const mockTestSubmissions: TestSubmission[] = [
  {
    id: "submission-1",
    studentId: "student-1",
    studentName: "Alice Johnson",
    tenantId: "tenant-1",
    testDate: "2026-01-01",
    submittedAt: "2026-01-01T14:30:00Z",
    sections: {
      listening: {
        answers: {
          l1: "University accommodation",
          l2: "300",
          l3: "This Friday",
          l4: "second",
        },
        score: 8.0,
      },
      reading: {
        answers: {
          q1: "Baron Karl von Drais",
          q2: "The bone shaker",
          q3: "FALSE",
          q4: "TRUE",
          q5: "women",
          q6: "Pneumatic tires",
          q7: "NOT GIVEN",
          q8: "equal",
        },
        score: 7.5,
      },
      writing: {
        answers: {
          w1: "The chart illustrates the enrollment numbers across various courses at a university. Engineering has the highest enrollment with approximately 450 students, followed by Business Studies with around 380 students. Computer Science shows strong numbers at 320 students, while Arts and Humanities has 280 enrolled students. The Sciences department has 250 students, and Social Sciences rounds out the data with 200 students. Overall, technical and business-oriented courses show higher enrollment compared to traditional arts and social sciences.",
          w2: "Technology has fundamentally transformed modern life, sparking debate about whether it has simplified or complicated our existence. While some argue that technology has made life more complex, I believe that overall, it has made our lives significantly easier and more efficient.\n\nThose who claim technology has increased complexity point to the constant need to learn new systems, deal with technical problems, and manage multiple devices and platforms. Additionally, the digital age has created new concerns such as cybersecurity, data privacy, and information overload. People now face the challenge of managing countless passwords, updating software, and troubleshooting various technical issues.\n\nHowever, I contend that technology has predominantly simplified our lives in numerous ways. Communication has become instantaneous and global through smartphones and the internet. Tasks that once took hours, such as research, shopping, or banking, can now be completed in minutes from the comfort of our homes. Automation has freed people from repetitive manual labor, and access to information has democratized education and knowledge.\n\nIn conclusion, while technology does present new challenges, its benefits far outweigh the complexities it introduces. The key is developing digital literacy to navigate these tools effectively.",
        },
        score: 7.0,
      },
      speaking: {
        answers: { s1: "Recorded response for speaking section" },
        score: 8.5,
      },
    },
    status: "graded",
    overallScore: 7.75,
  },
  {
    id: "submission-2",
    studentId: "student-2",
    studentName: "Bob Smith",
    tenantId: "tenant-1",
    testDate: "2026-01-01",
    submittedAt: "2026-01-01T15:45:00Z",
    sections: {
      reading: {
        answers: {
          q1: "Baron Karl von Drais",
          q2: "The bone shaker",
          q3: "TRUE",
          q4: "TRUE",
          q5: "women",
          q6: "Pneumatic tires",
          q7: "FALSE",
          q8: "equal",
        },
      },
      writing: {
        answers: {
          w1: "The chart shows student enrollment. Engineering has most students. Business is second. Other courses have fewer students.",
          w2: "Technology is good and bad. Some people like it. Some people dont like it. I think technology is good because it helps us do things faster. We can talk to friends easily. We can find information quickly. But technology can be difficult sometimes. In conclusion technology is mostly good.",
        },
      },
    },
    status: "pending-review",
    overallScore: undefined,
  },
];
