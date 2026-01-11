# IELTS CRM System - Complete Architecture Blueprint

## 1. MVP Definition

### Must-Have Features (Phase 1 - MVP)

#### Student Management

- ✅ Student registration & profile management
- ✅ Enrollment in groups/classes
- ✅ Attendance tracking (mark present/absent)
- ✅ Student dashboard (view progress, upcoming classes)

#### Teacher Management

- ✅ Teacher profile management
- ✅ Assign teachers to groups
- ✅ View teacher sessions
- ✅ Basic performance metrics (attendance rate, student count)

#### Group/Class Management

- ✅ Create/edit/delete groups
- ✅ Assign students to groups
- ✅ Assign teacher to group
- ✅ Set group pricing
- ✅ View group roster

#### Financial Tracking

- ✅ Record student payments
- ✅ Track payment status (paid/pending/overdue)
- ✅ Basic revenue reports (total collected, pending)
- ✅ Payment history per student

#### Academic Tracking

- ✅ Record mock test results (L/R/W/S scores)
- ✅ Track student progress over time
- ✅ Basic progress reports (score trends)

#### Mock IELTS Test Module (Simplified)

- ✅ Listening section with timer
- ✅ Reading section with timer
- ✅ Writing section (manual grading)
- ✅ Speaking section (manual grading)
- ✅ Auto-save progress
- ✅ Submit and store results

#### Authentication & Authorization

- ✅ Login/logout (JWT-based)
- ✅ Role-based access control (Admin, Teacher, Student)
- ✅ Password management

---

### Nice-to-Have Features (Phase 2 - Post-MVP)

- ❌ Advanced analytics dashboard (charts, trends)
- ❌ Expense tracking & profit calculation
- ❌ Automated attendance reminders (SMS/Email)
- ❌ Certificate generation
- ❌ Multi-center support (multi-tenancy)
- ❌ Speaking test recordings
- ❌ AI-powered writing evaluation
- ❌ Automated payment reminders
- ❌ Teacher commission calculation
- ❌ Student parent portal
- ❌ Calendar integration
- ❌ Video lessons library

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Admin Panel  │  │ Teacher App  │  │ Student App  │      │
│  │  (React/Next)│  │  (React/Next)│  │  (React/Next)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │ HTTP/REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY / LOAD BALANCER               │
│                      (Future: Nginx)                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (NestJS)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Controllers (HTTP Entry Points)              │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     Guards (JWT Auth, Role-Based Access Control)      │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Services (Business Logic Layer)             │  │
│  │  • AuthService        • StudentService                │  │
│  │  • TeacherService     • GroupService                  │  │
│  │  • PaymentService     • ExamsService                   │  │
│  │  • AttendanceService  • ReportService                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │       Repositories (Data Access via Prisma)           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                            │
│                   PostgreSQL 15+                            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               EXTERNAL SERVICES (Future)                    │
│  • File Storage (AWS S3 / Cloudinary)                      │
│  • Email Service (SendGrid / AWS SES)                      │
│  • SMS Service (Twilio)                                    │
│  • Payment Gateway (Stripe / PayPal)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Design (Enhanced Schema)

### Complete Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    User      │         │   Teacher    │         │   Student    │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │◄────────│ userId (FK)  │         │ id (PK)      │
│ email        │         │ firstName    │         │ userId (FK)  │◄─────┐
│ password     │         │ lastName     │         │ firstName    │      │
│ role (enum)  │     ┌───│ phone        │         │ lastName     │      │
│ createdAt    │     │   │ special...   │         │ phone        │      │
│ updatedAt    │     │   │ createdAt    │         │ level        │      │
└──────────────┘     │   │ updatedAt    │         │ groupId (FK) │      │
                     │   └──────────────┘         │ createdAt    │      │
                     │          │                 │ updatedAt    │      │
                     │          │ 1               └──────────────┘      │
                     │          │                        │              │
                     │          │                        │ N            │
                     │          │                        │              │
                     │          │ 1                      │              │
                     │    ┌─────▼──────┐                 │              │
                     └────│   Group    │◄────────────────┘              │
                          ├────────────┤                                │
                          │ id (PK)    │                                │
                          │ name       │                                │
                          │ teacherId  │                                │
                          │ priceId    │                                │
                          │ createdAt  │                                │
                          │ updatedAt  │                                │
                          └────────────┘                                │
                                 │                                      │
                        ┌────────┼────────┐                             │
                        │ 1      │ 1      │ N                           │
                        │        │        │                             │
                   ┌────▼────┐   │   ┌────▼──────────┐                  │
                   │  Price  │   │   │  Attendance   │                  │
                   ├─────────┤   │   ├───────────────┤                  │
                   │ id (PK) │   │   │ id (PK)       │                  │
                   │ name    │   │   │ studentId (FK)│──────────────────┘
                   │ amount  │   │   │ groupId (FK)  │
                   │ created │   │   │ date          │
                   │ updated │   │   │ status (enum) │
                   └─────────┘   │   │ createdAt     │
                                 │   └───────────────┘
                                 │
                        ┌────────┼────────┐
                        │ 1      │ 1      │ N
                        │        │        │
                   ┌────▼─────┐  │  ┌─────▼──────────┐
                   │ Payment  │  │  │  MockTest      │
                   ├──────────┤  │  ├────────────────┤
                   │ id (PK)  │  │  │ id (PK)        │
                   │ studentId│  │  │ studentId (FK) │
                   │ groupId  │  │  │ testDate       │
                   │ amount   │  │  │ listeningScore │
                   │ method   │  │  │ readingScore   │
                   │ status   │  │  │ writingScore   │
                   │ paidDate │  │  │ speakingScore  │
                   │ created  │  │  │ overallScore   │
                   └──────────┘  │  │ createdAt      │
                                 │  └────────────────┘
                                 │
                                 │
                          ┌──────▼─────────┐
                          │   Schedule     │
                          ├────────────────┤
                          │ id (PK)        │
                          │ groupId (FK)   │
                          │ dayOfWeek      │
                          │ startTime      │
                          │ endTime        │
                          │ createdAt      │
                          └────────────────┘
```

### Enhanced Prisma Schema

```prisma
generator client {
  provider     = "prisma-client-js"
  output       = "./generated"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  TEACHER
  STUDENT
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

enum PaymentStatus {
  PENDING
  PAID
  OVERDUE
  REFUNDED
}

enum PaymentMethod {
  CASH
  CARD
  BANK_TRANSFER
  ONLINE
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

// ─────────────────────────────────────────────────────────
// CORE MODELS
// ─────────────────────────────────────────────────────────

model User {
  id           String    @id @default(cuid())
  email        String    @unique @db.VarChar(100)
  password     String    @db.VarChar(512)
  role         Role      @default(STUDENT)
  isActive     Boolean   @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  // Relations
  teacher      Teacher?
  student      Student?

  @@index([email])
}

model Teacher {
  id             String   @id @default(cuid())
  userId         String   @unique
  firstName      String   @db.VarChar(100)
  lastName       String   @db.VarChar(100)
  phone          String   @db.VarChar(20)
  specialization String   @db.VarChar(100)
  bio            String?  @db.Text
  hourlyRate     Float?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  groups         Group[]

  @@index([userId])
}

model Student {
  id              String   @id @default(cuid())
  userId          String   @unique
  firstName       String   @db.VarChar(100)
  lastName        String   @db.VarChar(100)
  phone           String   @db.VarChar(20)
  level           String   @db.VarChar(20) // e.g., "Beginner", "Intermediate", "Advanced"
  targetScore     Float?   // Target IELTS score
  enrollmentDate  DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  group           Group?       @relation(fields: [groupId], references: [id])
  groupId         String?
  payments        Payment[]
  attendances     Attendance[]
  mockTests       MockTest[]

  @@index([userId])
  @@index([groupId])
}

model Group {
  id          String     @id @default(cuid())
  name        String     @db.VarChar(100)
  description String?    @db.Text
  maxStudents Int        @default(10)
  isActive    Boolean    @default(true)
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Foreign Keys
  teacherId   String
  priceId     String

  // Relations
  teacher     Teacher      @relation(fields: [teacherId], references: [id])
  price       Price        @relation(fields: [priceId], references: [id])
  students    Student[]
  sessions   Schedule[]
  attendances Attendance[]
  payments    Payment[]

  @@index([teacherId])
  @@index([priceId])
}

model Price {
  id          String   @id @default(cuid())
  name        String   @db.VarChar(100) // e.g., "Standard Monthly", "Intensive Course"
  amount      Float
  currency    String   @default("USD") @db.VarChar(3)
  description String?  @db.Text
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  groups      Group[]
}

// ─────────────────────────────────────────────────────────
// OPERATIONAL MODELS
// ─────────────────────────────────────────────────────────

model Schedule {
  id        String    @id @default(cuid())
  groupId   String
  dayOfWeek DayOfWeek
  startTime String    @db.VarChar(5) // "09:00"
  endTime   String    @db.VarChar(5) // "11:00"
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  group     Group     @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@index([groupId])
}

model Attendance {
  id        String           @id @default(cuid())
  studentId String
  groupId   String
  date      DateTime         @db.Date
  status    AttendanceStatus @default(PRESENT)
  notes     String?          @db.Text
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  // Relations
  student   Student          @relation(fields: [studentId], references: [id], onDelete: Cascade)
  group     Group            @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@unique([studentId, groupId, date])
  @@index([studentId])
  @@index([groupId])
  @@index([date])
}

model Payment {
  id          String        @id @default(cuid())
  studentId   String
  groupId     String?
  amount      Float
  method      PaymentMethod @default(CASH)
  status      PaymentStatus @default(PENDING)
  paidDate    DateTime?
  dueDate     DateTime?
  description String?       @db.Text
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Relations
  student     Student       @relation(fields: [studentId], references: [id], onDelete: Cascade)
  group       Group?        @relation(fields: [groupId], references: [id])

  @@index([studentId])
  @@index([groupId])
  @@index([status])
  @@index([paidDate])
}

// ─────────────────────────────────────────────────────────
// ACADEMIC MODELS
// ─────────────────────────────────────────────────────────

model MockTest {
  id             String   @id @default(cuid())
  studentId      String
  testDate       DateTime @db.Date
  listeningScore Float?
  readingScore   Float?
  writingScore   Float?
  speakingScore  Float?
  overallScore   Float?
  notes          String?  @db.Text
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  student        Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  sections       MockTestSection[]

  @@index([studentId])
  @@index([testDate])
}

model MockTestSection {
  id             String   @id @default(cuid())
  mockTestId     String
  sectionType    String   @db.VarChar(20) // "LISTENING", "READING", "WRITING", "SPEAKING"
  score          Float?
  maxScore       Float    @default(9.0)
  startedAt      DateTime?
  completedAt    DateTime?
  timeSpentSec   Int?
  answers        Json?    // Store answers in JSON format
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  mockTest       MockTest @relation(fields: [mockTestId], references: [id], onDelete: Cascade)

  @@index([mockTestId])
}
```

---

## 4. Backend Architecture & Folder Structure

### Current Stack

- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (@nestjs/jwt)
- **Validation**: class-validator
- **Logging**: Winston

### Recommended Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── generated/             # Prisma client
│
├── src/
│   ├── main.ts                # Application entry point
│   │
│   ├── app.module.ts          # Root module
│   ├── app.controller.ts      # Health check
│   ├── app.service.ts
│   │
│   ├── common/                # Shared utilities
│   │   ├── decorators/        # Custom decorators (@CurrentUser, @Roles)
│   │   ├── filters/           # Exception filters
│   │   ├── guards/            # Auth guards, Role guards
│   │   ├── interceptors/      # Logging, Transform interceptors
│   │   ├── pipes/             # Validation pipes
│   │   └── utils/             # Helper functions
│   │
│   ├── config/                # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   │
│   ├── prisma/                # Prisma service module
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── auth/                  # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/        # JWT strategy, Local strategy
│   │   ├── guards/            # JwtAuthGuard, RolesGuard
│   │   ├── dto/               # LoginDto, RegisterDto
│   │   └── entities/          # User entity representations
│   │
│   ├── users/                 # User management
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── students/              # Student management
│   │   ├── students.module.ts
│   │   ├── students.controller.ts
│   │   ├── students.service.ts
│   │   ├── dto/
│   │   │   ├── create-student.dto.ts
│   │   │   ├── update-student.dto.ts
│   │   │   └── enroll-student.dto.ts
│   │   └── entities/
│   │
│   ├── teachers/              # Teacher management
│   │   ├── teachers.module.ts
│   │   ├── teachers.controller.ts
│   │   ├── teachers.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── groups/                # Group/Class management
│   │   ├── groups.module.ts
│   │   ├── groups.controller.ts
│   │   ├── groups.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── sessions/             # Schedule management
│   │   ├── sessions.module.ts
│   │   ├── sessions.controller.ts
│   │   ├── sessions.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── attendance/            # Attendance tracking
│   │   ├── attendance.module.ts
│   │   ├── attendance.controller.ts
│   │   ├── attendance.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── payments/              # Payment management
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── prices/                # Pricing management
│   │   ├── prices.module.ts
│   │   ├── prices.controller.ts
│   │   ├── prices.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── mock-tests/            # Mock IELTS test module
│   │   ├── mock-tests.module.ts
│   │   ├── mock-tests.controller.ts
│   │   ├── mock-tests.service.ts
│   │   ├── dto/
│   │   │   ├── create-test.dto.ts
│   │   │   ├── submit-section.dto.ts
│   │   │   └── score-section.dto.ts
│   │   └── entities/
│   │
│   ├── reports/               # Analytics & Reports
│   │   ├── reports.module.ts
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   ├── dto/
│   │   └── types/
│   │
│   └── notifications/         # Future: Email/SMS notifications
│       ├── notifications.module.ts
│       ├── notifications.service.ts
│       └── templates/
│
├── test/                      # E2E tests
│   └── ...
│
├── .env                       # Environment variables
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 5. Key API Endpoints (MVP)

### Authentication (`/api/auth`)

```
POST   /auth/register          # Register new user
POST   /auth/login             # Login (returns JWT)
POST   /auth/logout            # Logout
POST   /auth/refresh           # Refresh token
GET    /auth/me                # Get current user info
```

### Students (`/api/students`)

```
GET    /students               # List all students (paginated)
GET    /students/:id           # Get student by ID
POST   /students               # Create new student
PATCH  /students/:id           # Update student
DELETE /students/:id           # Delete student
GET    /students/:id/progress  # Get student progress report
POST   /students/:id/enroll    # Enroll student in a group
```

### Teachers (`/api/teachers`)

```
GET    /teachers               # List all teachers
GET    /teachers/:id           # Get teacher by ID
POST   /teachers               # Create new teacher
PATCH  /teachers/:id           # Update teacher
DELETE /teachers/:id           # Delete teacher
GET    /teachers/:id/schedule  # Get teacher's schedule
GET    /teachers/:id/groups    # Get teacher's groups
```

### Groups (`/api/groups`)

```
GET    /groups                 # List all groups
GET    /groups/:id             # Get group by ID
POST   /groups                 # Create new group
PATCH  /groups/:id             # Update group
DELETE /groups/:id             # Delete group
GET    /groups/:id/students    # Get students in group
GET    /groups/:id/schedule    # Get group schedule
POST   /groups/:id/schedule    # Add schedule to group
```

### Attendance (`/api/attendance`)

```
GET    /attendance             # List attendance records (filtered)
POST   /attendance             # Mark attendance
PATCH  /attendance/:id         # Update attendance
GET    /attendance/group/:groupId/date/:date  # Get attendance for group on date
GET    /attendance/student/:studentId         # Get student's attendance history
```

### Payments (`/api/payments`)

```
GET    /payments               # List all payments (filtered)
GET    /payments/:id           # Get payment by ID
POST   /payments               # Record new payment
PATCH  /payments/:id           # Update payment
DELETE /payments/:id           # Delete payment
GET    /payments/student/:id   # Get payments for student
GET    /payments/pending       # Get all pending payments
GET    /payments/overdue       # Get all overdue payments
```

### Mock Tests (`/api/mock-tests`)

```
GET    /mock-tests             # List all tests
GET    /mock-tests/:id         # Get test details
POST   /mock-tests             # Create new test
POST   /mock-tests/:id/sections/:sectionType/start   # Start a section
POST   /mock-tests/:id/sections/:sectionType/submit  # Submit section answers
PATCH  /mock-tests/:id/sections/:sectionType/score   # Grade section (manual)
GET    /mock-tests/student/:id # Get student's test history
```

### Reports (`/api/reports`)

```
GET    /reports/revenue        # Revenue report (date range)
GET    /reports/attendance     # Attendance summary
GET    /reports/student-progress/:id  # Student progress over time
GET    /reports/teacher-performance   # Teacher performance metrics
```

---

## 6. Step-by-Step Development Roadmap

### Phase 0: Setup & Prerequisites (Week 1)

- [x] Initialize NestJS project
- [x] Setup Prisma with PostgreSQL
- [x] Configure environment variables
- [ ] Setup Winston logging
- [ ] Create base exception filters
- [ ] Setup validation pipes globally

### Phase 1: Core Authentication (Week 1)

- [ ] Implement User authentication (JWT)
- [ ] Create auth guards (JwtAuthGuard, RolesGuard)
- [ ] Add decorators (@CurrentUser, @Roles)
- [ ] Test login/register flows

### Phase 2: User Management (Week 2)

- [ ] Complete Student CRUD operations
- [ ] Complete Teacher CRUD operations
- [ ] Implement role-based access control
- [ ] Add pagination & filtering
- [ ] Test endpoints

### Phase 3: Group & Pricing (Week 2-3)

- [ ] Implement Group CRUD
- [ ] Implement Price CRUD
- [ ] Add student enrollment logic
- [ ] Create schedule management
- [ ] Test group operations

### Phase 4: Attendance System (Week 3)

- [ ] Implement attendance recording
- [ ] Add bulk attendance marking (for entire group)
- [ ] Create attendance reports
- [ ] Test attendance flows

### Phase 5: Payment System (Week 4)

- [ ] Implement payment recording
- [ ] Add payment status tracking
- [ ] Create payment history per student
- [ ] Implement overdue payment detection
- [ ] Test payment flows

### Phase 6: Mock Test Module (Week 5-6)

- [ ] Design test data structure
- [ ] Implement test creation & management
- [ ] Build section-by-section test flow
- [ ] Add timer functionality (frontend)
- [ ] Implement answer submission
- [ ] Add manual grading interface
- [ ] Store and calculate scores
- [ ] Test complete test flow

### Phase 7: Reports & Analytics (Week 7)

- [ ] Revenue reports (daily, monthly, yearly)
- [ ] Attendance summary reports
- [ ] Student progress tracking
- [ ] Teacher performance metrics
- [ ] Export functionality (CSV/PDF)

### Phase 8: Testing & QA (Week 8)

- [ ] Write unit tests for services
- [ ] Write E2E tests for critical flows
- [ ] Load testing
- [ ] Security audit
- [ ] Fix bugs

### Phase 9: Deployment (Week 9)

- [ ] Setup CI/CD pipeline
- [ ] Configure production database
- [ ] Deploy to cloud (AWS/Heroku/DigitalOcean)
- [ ] Setup monitoring (Sentry, LogRocket)
- [ ] Create documentation

---

## 7. Assumptions, Risks & Scalability Considerations

### Assumptions

1. **Single Center MVP**: Initially building for a single IELTS center (multi-tenancy later)
2. **Manual Test Grading**: Writing and Speaking sections will be graded manually by teachers
3. **Simple Payment Tracking**: No integration with payment gateways initially
4. **Basic Reporting**: Simple reports, no advanced analytics/BI tools
5. **Email/SMS Optional**: Notifications are post-MVP features
6. **Admin-Managed Users**: Admin creates teacher/student accounts (no self-registration)

### Risks & Mitigation

| Risk                            | Impact | Mitigation                                                      |
| ------------------------------- | ------ | --------------------------------------------------------------- |
| **Data Loss**                   | High   | Regular automated backups, database replication                 |
| **Unauthorized Access**         | High   | Strict JWT validation, role-based access control, rate limiting |
| **Payment Discrepancies**       | High   | Audit logs for all payment operations, reconciliation reports   |
| **Poor Performance**            | Medium | Database indexing, caching (Redis), query optimization          |
| **Incomplete Test Submissions** | Medium | Auto-save functionality, session recovery                       |
| **Teacher Availability**        | Low    | Flexible scheduling, substitute teacher assignment              |

### Scalability Considerations

#### Database Optimization

- **Indexes**: Add indexes on frequently queried fields (email, groupId, studentId, date)
- **Partitioning**: Partition large tables (attendance, payments) by date
- **Read Replicas**: For read-heavy operations (reports)

#### Caching Strategy

- Cache frequently accessed data (group rosters, teacher sessions)
- Use Redis for session management
- Cache computed reports

#### API Optimization

- Implement pagination for all list endpoints
- Add field selection (GraphQL-style) to reduce payload
- Rate limiting per user/IP

#### Future Architecture (Multi-Tenancy)

- Add `centerId` field to all models
- Implement tenant isolation at database level
- Row-level security (RLS) in PostgreSQL
- Separate schemas per tenant (advanced)

#### Horizontal Scaling

- Stateless API design (JWT, no sessions)
- Load balancer (Nginx/AWS ALB)
- Container orchestration (Docker + Kubernetes)

#### File Storage

- Move to S3/Cloudinary for test audio files, student documents
- CDN for static assets

---

## 8. Technology Recommendations

### Already Chosen ✅

- **Backend**: NestJS + TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT

### Additional Recommendations

#### Backend

- **Validation**: `class-validator` + `class-transformer` ✅
- **Logging**: Winston ✅
- **API Documentation**: Swagger (@nestjs/swagger)
- **Testing**: Jest (unit) + Supertest (E2E)

#### DevOps

- **Containerization**: Docker
- **CI/CD**: GitHub Actions or GitLab CI
- **Hosting**: Railway, Render, or DigitalOcean (MVP) → AWS (Scale)
- **Monitoring**: Sentry (errors) + LogRocket (analytics)

#### Frontend (Recommended)

- **Framework**: Next.js 14 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand or TanStack Query
- **Forms**: React Hook Form + Zod

---

## 9. Security Checklist

- [ ] Bcrypt password hashing (10+ rounds)
- [ ] JWT with short expiration (15 min access, 7 day refresh)
- [ ] HTTPS only in production
- [ ] CORS configuration (whitelist frontend domain)
- [ ] Rate limiting on auth endpoints
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (sanitize inputs)
- [ ] CSRF tokens for state-changing operations
- [ ] Environment variables for secrets
- [ ] Role-based access control on all endpoints

---

## 10. Next Immediate Steps

1. **Update Prisma Schema** with the enhanced models above
2. **Run Migration**: `npx prisma migrate dev --name enhanced-schema`
3. **Generate Prisma Client**: `npx prisma generate`
4. **Create Module Structure**: Generate modules for each domain
5. **Implement Auth Module**: Complete JWT authentication
6. **Build CRUD for Students/Teachers/Groups**: Complete basic operations
7. **Add Guards & Decorators**: Protect routes with authentication
8. **Test with Bruno/Postman**: Validate all endpoints
9. **Build Frontend**: Start with admin dashboard

---

## Appendix: Example DTO Structures

### CreateStudentDto

```typescript
export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  level: string; // "Beginner", "Intermediate", "Advanced"

  @IsOptional()
  @IsNumber()
  targetScore?: number;
}
```

### CreateGroupDto

```typescript
export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsString()
  @IsNotEmpty()
  priceId: string;

  @IsNumber()
  @Min(1)
  @Max(30)
  maxStudents: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;
}
```

### MarkAttendanceDto

```typescript
export class MarkAttendanceDto {
  @IsString()
  studentId: string;

  @IsString()
  groupId: string;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
```

---

**End of Architecture Document**
