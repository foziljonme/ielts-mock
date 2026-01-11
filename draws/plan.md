# IELTS CRM System - Design & Implementation Plan

## 1. MVP Definition

### Must-Have (Core MVP)

- **User Management**: Admin, Teacher, Student roles. Authentication (JWT).
- **Student Management**: Profiles, enrollment in groups, attendance tracking.
- **Group Management**: Class groups, sessions.
- **Mock Test Module (Core Value)**:
  - Create/Edit Tests (Listening, Reading, Writing, Speaking).
  - Assign tests to students/groups.
  - Take tests (simulate exam environment with timers).
  - Auto-grading for Reading/Listening.
  - Manual grading interface for Writing/Speaking.
- **Academic Tracking**: Simple gradebook, view test results.
- **Financial Basics**: Record student fee payments, track pending payments.

### Nice-to-Have (Post-MVP/Phase 2)

- **Advanced Financials**: Expense tracking, profit/loss reports, automated invoicing.
- **Teacher Performance**: Automate metrics based on student results/feedback.
- **CRM Pipeline**: Lead management (crm for potential students), follow-up reminders.
- **Resources Library**: File sharing for study materials.
- **Advanced Analytics**: Trend analysis for student progress.

---

## 2. System Architecture

### High-Level Components

1.  **Client (Frontend)**: React/Next.js/Vue (SPA) or similar.
    - _Admin Portal_: For center owners/staff.
    - _Student Portal_: For taking tests and checking progress.
2.  **API Gateway / Backend**: NestJS (Monolith).
    - Handles all business logic, auth, and data processing.
3.  **Database**: PostgreSQL.
    - Relational data for users, tests, results, and finance.
4.  **File Storage**: AWS S3 or Local (for MVP).
    - Storing listening audio files, user avatars, writing submissions.

### Backend Structure (NestJS)

**Modular Monolith Architecture** to ensure separation of concerns while keeping deployment simple.

```text
src/
├── app.module.ts
├── common/             # Global guards, pipes, filters, decorators
├── config/             # Configuration (Env validation)
├── auth/               # Auth module (JWT strategies)
├── users/              # User management (Staff, Teachers, Students)
├── groups/             # Class groups & scheduling
├── students/           # Student specific logic (enrollment, attendance)
├── finance/            # Payments & Fees
├── academic/           # Gradebook & Reports
├── exams/              # The Mock Test Engine (Complex Module)
│   ├── use-cases/      # CreateTest, SubmitAttempt, GradeAttempt
│   ├── entities/       # Test, Section, Question, Attempt
│   └── ...
└── uploads/            # File handling
```

---

## 3. Database Design (Prisma Schema Draft)

### Users & Roles

- **User**: `id`, `email`, `password`, `role` (ADMIN, TEACHER, STUDENT), `profile` (Json)

### CRM / Operations

- **Group**: `id`, `name`, `teacherId`, `schedule`, `startDate`, `endDate`
- **Enrollment**: `studentId`, `groupId`, `status` (ACTIVE, COMPLETED, DRAWN)
- **Attendance**: `enrollmentId`, `date`, `status` (PRESENT, ABSENT, LATE)
- **Payment**: `studentId`, `amount`, `date`, `type` (TUITION, BOOK, EXAM), `status` (PAID, PENDING)

### Mock Test Engine

- **MockTest**: `id`, `title`, `type` (ACADEMIC, GENERAL)
- **TestSection**: `id`, `testId`, `type` (LISTENING, READING, WRITING, SPEAKING), `order`
- **QuestionGroup**: `id`, `sectionId`, `passageText` (for reading), `audioUrl`, `instruction`
- **Question**: `id`, `groupId`, `type` (MCQ, FILL_GAP, MATCHING), `correctAnswer`, `points`
- **TestAttempt**: `id`, `studentId`, `testId`, `status` (STARTED, SUBMITTED, GRADED), `score`, `startedAt`, `completedAt`
- **Answer**: `id`, `attemptId`, `questionId`, `userResponse`, `isCorrect`, `score`

---

## 4. Key API Endpoints (MVP)

**Auth**

- `POST /auth/login`
- `POST /auth/register` (Admin only usually, or public for leads)

**Operations**

- `GET /students` - List students with pagination/filters
- `POST /students` - Create student profile
- `POST /enrollments` - Enroll student in group
- `POST /attendance/batch` - Mark attendance for a class
- `POST /payments` - Record a payment

**Exams (Mock Test)**

- `POST /exams` - Create a new mock test structure
- `GET /exams/:id/start` - Student starts a test (returns structure without answers)
- `POST /exams/:attemptId/submit` - Submit section/full test
- `GET /exams/grading/:attemptId` - Teacher view for grading

---

## 5. Development Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [x] Project Setup (NestJS, Prisma)
- [ ] Database Schema Finalization (Users, Groups, Basic Finance)
- [ ] Authentication & Authorization Implementation
- [ ] CRUD for Users (Teachers/Students) & Groups

### Phase 2: Operations Core (Weeks 3-4)

- [ ] Student Enrollment Logic
- [ ] Attendance System
- [ ] Basic Payment Logging
- [ ] API endpoints for Admin Frontend

### Phase 3: The Exam Engine (Weeks 5-8) _Critical Path_

- [ ] Design Exam Data Model (Question types are complex)
- [ ] Implement Test Creator API using `MultiReplaceFileContentTool` approach equivalent for JSON structure
- [ ] Implement Test Taker API (State management, timers)
- [ ] Implement Auto-grader backbone

### Phase 4: Reporting & Polish (Weeks 9-10)

- [ ] Student Result Dashboard
- [ ] Manual Grading Interface for Writing/Speaking
- [ ] Deployment Setup (Docker/PM2)

---

## 6. Assumptions & Risks

- **Assumption**: We can store audio files locally for MVP.
  - _Risk_: Storage fills up. _Mitigation_: Use S3 abstraction from day 1.
- **Assumption**: Real-time requirements are low.
  - _Risk_: Multiple students taking tests simultaneously loads DB. _Mitigation_: Cache test structure in Redis or Memory.
- **Risk**: Complex IELTS question types (Drag and drop, matching headings) are hard to model.
  - _Mitigation_: Store question content as flexible JSONB where schemas vary wildy.
