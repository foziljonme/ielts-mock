# API Design for Multi-Tenant Education Platform

This document outlines the REST API endpoints for managing tenants, users, courses, sessions, attendance, and finance. It is designed for a multi-tenant system with Prisma ORM backend.

---

## 1️⃣ TENANT

**Purpose:** Manage tenants (organizations or schools).

| Done | Method | URL                     | Description       |
| :--: | :----- | :---------------------- | :---------------- |
| [x]  | GET    | `/platform/tenants`     | List all tenants  |
| [x]  | GET    | `/platform/tenants/:id` | Get tenant by ID  |
| [x]  | POST   | `/platform/tenants`     | Create a tenant   |
| [x]  | PATCH  | `/platform/tenants/:id` | Update tenant     |
| [x]  | DELETE | `/platform/tenants/:id` | Deactivate tenant |

---

## 2️⃣ USERS / ROLES

**Purpose:** Authentication, RBAC, users.

### Users

| Done | Method | URL                   | Description         |                      Note                      |
| :--: | :----- | :-------------------- | :------------------ | :--------------------------------------------: |
| [x]  | GET    | `/platform/users`     | List users          | All the user endpoints will be under platform. |
| [x]  | GET    | `/platform/users/:id` | Get user profile    |                                                |
| [ ]  | POST   | `/platform/users`     | Create user         |        NOT DOING, CHECK ADMIN ENDPOINT         |
| [x]  | PUT    | `/platform/users/:id` | Update user info    |                                                |
| [x]  | DELETE | `/platform/users/:id` | Delete/disable user |                                                |

### Roles // Removed in-v1, only hardcoded roles as strings

| Done | Method | URL                               | Description                |                      Note                      |
| :--: | :----- | :-------------------------------- | :------------------------- | :--------------------------------------------: |
| [x]  | GET    | `/platform/roles`                 | List roles                 | All the role endpoints will be under platform. |
| [x]  | POST   | `/platform/roles`                 | Create role                |                                                |
| [x]  | PATCH  | `/platform/roles/:id`             | Update role                |                                                |
| [x]  | DELETE | `/platform/roles/:id`             | Delete role                |                                                |
| [ ]  | POST   | `/platform/roles/:id/permissions` | Assign permissions to role |

---

## 3️⃣ STUDENTS / TEACHERS

### Students

| Done | Method | URL             | Description                                  |
| :--: | :----- | :-------------- | :------------------------------------------- |
| [x]  | GET    | `/students`     | List all students for tenant                 |
| [x]  | GET    | `/students/:id` | Get student profile + enrollments + invoices |
| [x]  | POST   | `/students`     | Create student                               |
| [x]  | PUT    | `/students/:id` | Update status, profile                       |
| [x]  | DELETE | `/students/:id` | Soft delete / deactivate                     |

### Teachers

| Done | Method | URL             | Description                           |
| :--: | :----- | :-------------- | :------------------------------------ |
| [x]  | GET    | `/teachers`     | List teachers                         |
| [x]  | GET    | `/teachers/:id` | Get teacher profile + assigned groups |
| [x]  | POST   | `/teachers`     | Create teacher                        |
| [x]  | PUT    | `/teachers/:id` | Update teacher info                   |
| [x]  | DELETE | `/teachers/:id` | Soft delete                           |

---

## 4️⃣ COURSES / PRICES / SCHEDULES

### Courses

| Done | Method | URL            | Description                            |
| :--: | :----- | :------------- | :------------------------------------- |
| [ ]  | GET    | `/courses`     | List courses                           |
| [ ]  | GET    | `/courses/:id` | Get course details + sessions + prices |
| [ ]  | POST   | `/courses`     | Create course                          |
| [ ]  | PUT    | `/courses/:id` | Update course info                     |
| [ ]  | DELETE | `/courses/:id` | Delete course                          |

### Course Prices

| Done | Method | URL                            | Description            |
| :--: | :----- | :----------------------------- | :--------------------- |
| [ ]  | GET    | `/courses/:id/prices`          | List historical prices |
| [ ]  | POST   | `/courses/:id/prices`          | Create new price       |
| [ ]  | PUT    | `/courses/:id/prices/:priceId` | Update price           |

### Course Schedules

| Done | Method | URL                     | Description     |
| :--: | :----- | :---------------------- | :-------------- |
| [ ]  | GET    | `/courses/:id/sessions` | List sessions   |
| [ ]  | POST   | `/courses/:id/sessions` | Create schedule |
| [ ]  | PUT    | `/sessions/:id`         | Update schedule |
| [ ]  | DELETE | `/sessions/:id`         | Remove schedule |

---

## 5️⃣ GROUPS / GROUP SCHEDULES / SESSIONS

### Groups

| Done | Method | URL           | Description                              |
| :--: | :----- | :------------ | :--------------------------------------- |
| [ ]  | GET    | `/groups`     | List groups                              |
| [ ]  | GET    | `/groups/:id` | Get group details, sessions, enrollments |
| [ ]  | POST   | `/groups`     | Create group                             |
| [ ]  | PUT    | `/groups/:id` | Update group info                        |
| [ ]  | DELETE | `/groups/:id` | Soft delete group                        |

### Group Schedules

CRUD endpoints: `/groups/:id/sessions`

### Sessions

| Done | Method | URL                    | Description                   |
| :--: | :----- | :--------------------- | :---------------------------- |
| [ ]  | GET    | `/groups/:id/sessions` | List sessions for group       |
| [ ]  | GET    | `/sessions/:id`        | Session details + attendance  |
| [ ]  | POST   | `/groups/:id/sessions` | Generate sessions             |
| [ ]  | PUT    | `/sessions/:id`        | Update session status / times |
| [ ]  | DELETE | `/sessions/:id`        | Remove session                |

---

## 6️⃣ ENROLLMENTS / ATTENDANCE

### Enrollments

| Done | Method | URL                         | Description              |
| :--: | :----- | :-------------------------- | :----------------------- |
| [ ]  | GET    | `/students/:id/enrollments` | List student enrollments |
| [ ]  | POST   | `/enrollments`              | Create enrollment        |
| [ ]  | PUT    | `/enrollments/:id`          | Update status            |
| [ ]  | DELETE | `/enrollments/:id`          | Cancel enrollment        |

### Attendance

| Done | Method | URL                         | Description              |
| :--: | :----- | :-------------------------- | :----------------------- |
| [ ]  | GET    | `/sessions/:id/attendances` | List attendances         |
| [ ]  | POST   | `/sessions/:id/attendances` | Mark attendances         |
| [ ]  | PUT    | `/attendances/:id`          | Update attendance        |
| [ ]  | DELETE | `/attendances/:id`          | Remove attendance record |

---

## 7️⃣ FINANCE (Invoices / Payments / Allocations)

### Invoices

| Done | Method | URL                      | Description    |
| :--: | :----- | :----------------------- | :------------- |
| [ ]  | GET    | `/students/:id/invoices` | List invoices  |
| [ ]  | GET    | `/invoices/:id`          | Invoice detail |
| [ ]  | POST   | `/invoices`              | Create invoice |
| [ ]  | PUT    | `/invoices/:id`          | Update invoice |
| [ ]  | DELETE | `/invoices/:id`          | Cancel invoice |

### Invoice Lines

CRUD via `/invoices/:id/lines`

### Payments

| Done | Method | URL                      | Description             |
| :--: | :----- | :----------------------- | :---------------------- |
| [ ]  | GET    | `/students/:id/payments` | List payments           |
| [ ]  | GET    | `/payments/:id`          | Payment detail          |
| [ ]  | POST   | `/payments`              | Record payment          |
| [ ]  | PUT    | `/payments/:id`          | Update payment          |
| [ ]  | DELETE | `/payments/:id`          | Delete / refund payment |

### Payment Allocations

| Done | Method | URL                             | Description          |
| :--: | :----- | :------------------------------ | :------------------- |
| [ ]  | POST   | `/payments/:id/allocations`     | Allocate to invoices |
| [ ]  | DELETE | `/payments/:id/allocations/:id` | Remove allocation    |

---

## 8️⃣ MOCK IELTS

| Done | Method | URL                        | Description             |
| :--: | :----- | :------------------------- | :---------------------- |
| [ ]  | GET    | `/mock-tests`              | List tests              |
| [ ]  | GET    | `/mock-tests/:id`          | Test details + sections |
| [ ]  | POST   | `/mock-tests`              | Create test             |
| [ ]  | PUT    | `/mock-tests/:id`          | Update test             |
| [ ]  | DELETE | `/mock-tests/:id`          | Deactivate test         |
| [ ]  | POST   | `/mock-tests/:id/attempts` | Record student attempt  |
| [ ]  | GET    | `/mock-tests/:id/attempts` | List attempts           |

---

## 9️⃣ GENERAL BACKEND RECOMMENDATIONS

1.  **Multi-tenant**: Always filter queries by `tenantId`.
2.  **Audit fields**: `createdBy` and `updatedBy`.
3.  **Pagination & filtering**: `limit`, `offset`, `sort`.
4.  **Validation**: Amounts ≥ 0, dates valid, enrollment status constraints.
5.  **Transactions**: Payments & allocations must be atomic.
6.  **Batch operations**: Auto-generate sessions, batch attendance.
7.  **Dashboard support**: Aggregates for revenue, enrollment stats.
