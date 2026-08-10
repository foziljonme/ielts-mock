# IELTS CD Mock Exam Platform — API & Auth Architecture

Reference companion to the Prisma schema. Assumes a standard REST backend (Node/Express-style, but framework-agnostic) with Postgres via Prisma, a WebSocket/pub-sub layer for live sync, and a scheduler/worker for time-based transitions. Base path: `/api/v1`.

---

## 1. Actors & Frontends

| Actor | Frontend | Notes |
| Platform Admin | Platform Console | Cross-tenant. Hosted on a non-tenant domain, e.g. `admin.yourapp.com`. |
| Tenant Admin | Admin Console | Manages one education center. Hosted per-tenant subdomain. |
| Staff / Invigilator | Admin Console (subset) | Same app as Tenant Admin, scoped to assigned sessions. |
| Candidate | Exam Client | Kiosk-style, full-screen, minimal chrome — mirrors real CD IELTS. No persistent account. |

Two identity systems, not one — this is the most important structural decision:

- **Staff/admin identity** → `User` table, email+password, JWT session.
- **Candidate identity** → `ExamSeat.accessCode`, no password, no persistent account, ephemeral seat-scoped JWT valid only for that sitting.

> **Schema note:** `UserRole` includes `CANDIDATE`, but `ExamSeat.candidateId` is a free-text string, not a relation to `User`. As written, a candidate never needs a `User` row — they just need a seat and an access code. That's the right call for walk-in mock-test candidates. If you later want a candidate portal (login once, see history across multiple sittings), you'd add an explicit `User`-to-`ExamSeat` link and treat access-code login as _one_ way to claim a seat, not the only way. Worth confirming which model you actually want before building the candidate login screen, since it changes the auth flow below.

---

## 2. Auth Model

### 2.1 Tenant resolution

Every request to the Admin Console or Exam Client is tenant-scoped by subdomain:

```
{tenant-subdomain}.yourapp.com  →  Tenant.subdomain lookup
```

Middleware order, on every request:

1. **`resolveTenant`** — extract subdomain from `Host` (or an `X-Tenant-Id` header for local dev/tests) → look up `Tenant` → 404 if not found, 403 if `isActive = false`. Attach `tenant` to request context.
2. **`verifyJWT`** — validate signature/expiry, decode claims.
3. **`assertTenantMatch`** — `token.tenantId === tenant.id`, except `PLATFORM_ADMIN` tokens (`tenantId: null`) which are allowed through and treated as tenant-authorized for read/admin purposes only.
4. **`requireRole([...])`** — route-level allow-list.
5. **`assertResourceScope`** — e.g. a `STAFF` user acting on a session must have an `ExamSessionInvigilator` row for it, unless they're `TENANT_ADMIN`.

The Platform Console doesn't go through tenant resolution at all — it lives on its own host and every route requires `PLATFORM_ADMIN`.

### 2.2 Token types

**Staff JWT** (access + refresh pair)

```json
{ "sub": "userId", "tenantId": "string | null", "roles": ["TENANT_ADMIN"], "iat": ..., "exp": ... }
```

Short-lived access token (~15 min), refresh token (~7–14 days, rotated on use, revocable per-device via a stored token family or version counter on `User`).

**Seat JWT** (candidate)

```json
{ "sub": "seatId", "sessionId": "...", "tenantId": "...", "scope": "seat", "iat": ..., "exp": ... }
```

Issued only from `accessCode`, no password. Expiry = expected session end + a short grace window (e.g. +30 min for force-submit/review flows), not a rolling session. Scoped **only** to `/seat/*` routes — a seat token must never be valid on any staff route, even by accident of role-check ordering.

Since `accessCode` is a single-factor, no-username secret, rate-limit `/seat/login` aggressively (per-IP and per-code) and consider a short cooldown after repeated failures — it's the only thing standing between a stranger and someone's exam.

### 2.3 RBAC matrix

| Capability                   | PLATFORM_ADMIN | TENANT_ADMIN    | STAFF                           | Seat token         |
| ---------------------------- | -------------- | --------------- | ------------------------------- | ------------------ |
| Manage tenants               | ✅             | ❌              | ❌                              | ❌                 |
| Manage shared test library   | ✅             | ❌              | ❌                              | ❌                 |
| Manage tenant users          | ❌             | ✅ (own tenant) | ❌                              | ❌                 |
| Manage tenant-custom tests   | ❌             | ✅              | ❌                              | ❌                 |
| Schedule / edit sessions     | ❌             | ✅              | ❌                              | ❌                 |
| Manage seat roster           | ❌             | ✅              | ➖ (view only, unless assigned) | ❌                 |
| Start/pause/end sections     | ❌             | ✅              | ✅ (assigned sessions only)     | ❌                 |
| Force-submit / extend time   | ❌             | ✅              | ✅ (assigned sessions only)     | ❌                 |
| View live dashboard          | ❌             | ✅              | ✅ (assigned sessions only)     | ❌                 |
| Enter scores                 | ❌             | ✅              | ✅ (assigned sessions only)     | ❌                 |
| Take exam / answer questions | ❌             | ❌              | ❌                              | ✅ (own seat only) |

---

## 3. Platform-Level API (cross-tenant)

Host: `admin.yourapp.com`. Role: `PLATFORM_ADMIN` on everything except the public tenant-resolve call.

| Method | Path                                  | Purpose                                                                                                                                |
| ------ | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/v1/tenants/resolve?subdomain=`  | **Public.** Frontend calls this on load to fetch tenant branding (name, logo, active status) before rendering a login screen. No auth. |
| POST   | `/api/v1/platform/tenants`            | Create a tenant (creates `Tenant` + zeroed `TenantSeatUsage` row).                                                                     |
| GET    | `/api/v1/platform/tenants`            | List/search tenants.                                                                                                                   |
| GET    | `/api/v1/platform/tenants/:id`        | Tenant detail.                                                                                                                         |
| PATCH  | `/api/v1/platform/tenants/:id`        | Update name, `seatQuota`, `isActive`.                                                                                                  |
| GET    | `/api/v1/platform/tenants/:id/usage`  | `TenantSeatUsage` (used vs quota).                                                                                                     |
| POST   | `/api/v1/platform/tenants/:id/admins` | Bootstrap the first `TENANT_ADMIN` user for a new tenant.                                                                              |
| POST   | `/api/v1/platform/tests`              | Import a shared/platform-wide test (`Test.tenantId = null`) from the external JSON content store; computes `contentHash`.              |
| GET    | `/api/v1/platform/tests`              | List shared library tests.                                                                                                             |
| PATCH  | `/api/v1/platform/tests/:id`          | Activate/deactivate a shared test.                                                                                                     |

---

## 4. Auth API

| Method | Path                   | Purpose                                                                                                                                             |
| ------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/auth/login`   | Staff login: `{ email, password }`. Tenant resolved from subdomain; platform admins log in on `admin.yourapp.com`. Returns access + refresh JWT.    |
| POST   | `/api/v1/auth/refresh` | Rotate access token from refresh token.                                                                                                             |
| POST   | `/api/v1/auth/logout`  | Revoke current refresh token.                                                                                                                       |
| GET    | `/api/v1/auth/me`      | Current staff user + tenant + roles.                                                                                                                |
| POST   | `/api/v1/seat/login`   | Candidate login: `{ accessCode }`. Looks up `ExamSeat` (globally unique code), validates session is not `CANCELLED`, issues seat JWT. Rate-limited. |

---

## 5. Tenant-Scoped Admin/Staff API

All routes below go through `resolveTenant` + `verifyJWT` + `assertTenantMatch`.

### 5.1 Users

| Method | Path                | Roles        | Purpose                         |
| ------ | ------------------- | ------------ | ------------------------------- |
| POST   | `/api/v1/users`     | TENANT_ADMIN | Create staff/tenant-admin user. |
| GET    | `/api/v1/users`     | TENANT_ADMIN | List tenant's staff.            |
| PATCH  | `/api/v1/users/:id` | TENANT_ADMIN | Deactivate, change role.        |

### 5.2 Test catalog

| Method | Path                         | Roles               | Purpose                                                                                |
| ------ | ---------------------------- | ------------------- | -------------------------------------------------------------------------------------- |
| GET    | `/api/v1/tests`              | TENANT_ADMIN, STAFF | List available tests: shared library + tenant-custom.                                  |
| POST   | `/api/v1/tests`              | TENANT_ADMIN        | Import a tenant-custom test from external JSON; snapshots `contentHash`.               |
| GET    | `/api/v1/tests/:id`          | TENANT_ADMIN, STAFF | Test detail.                                                                           |
| PATCH  | `/api/v1/tests/:id`          | TENANT_ADMIN        | Activate/deactivate.                                                                   |
| PUT    | `/api/v1/tests/:id/sections` | TENANT_ADMIN        | Define/update `TestSectionConfig` (order, `durationSec`, `questionCount` per section). |

### 5.3 Exam sessions (scheduling)

| Method | Path                                        | Roles               | Purpose                                                                                                                                                                                                                                     |
| ------ | ------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/sessions`                          | TENANT_ADMIN        | Create a sitting: `{ testId, name, examDate }`. On creation, **snapshot** each `TestSectionConfig` into an `ExamSessionProgress` row (`NOT_STARTED`, `plannedDurationSec` frozen) — this is what makes later edits to the source test safe. |
| GET    | `/api/v1/sessions?status=&date=`            | TENANT_ADMIN, STAFF | List sessions (staff sees only assigned ones unless admin).                                                                                                                                                                                 |
| GET    | `/api/v1/sessions/:id`                      | TENANT_ADMIN, STAFF | Full detail: seats, section progress, invigilators.                                                                                                                                                                                         |
| PATCH  | `/api/v1/sessions/:id`                      | TENANT_ADMIN        | Edit name/date — only while `SCHEDULED`.                                                                                                                                                                                                    |
| DELETE | `/api/v1/sessions/:id`                      | TENANT_ADMIN        | Cancel — only pre-start; sets `CANCELLED`, logs `SESSION_CANCELLED` event.                                                                                                                                                                  |
| POST   | `/api/v1/sessions/:id/invigilators`         | TENANT_ADMIN        | Assign staff (`{ userId }`).                                                                                                                                                                                                                |
| DELETE | `/api/v1/sessions/:id/invigilators/:userId` | TENANT_ADMIN        | Unassign.                                                                                                                                                                                                                                   |

### 5.4 Seat roster

| Method | Path                                                 | Roles               | Purpose                                                                                                                                                                          |
| ------ | ---------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/sessions/:id/seats`                         | TENANT_ADMIN        | Add a candidate: `{ candidateName, candidateId, candidateContact, extraTimeSec? }`. Auto-assigns `seatNumber`, generates unique `accessCode`. **Enforces `seatQuota`** (see §7). |
| POST   | `/api/v1/sessions/:id/seats/bulk-import`             | TENANT_ADMIN        | CSV roster import, same quota check applied to the batch.                                                                                                                        |
| GET    | `/api/v1/sessions/:id/seats`                         | TENANT_ADMIN, STAFF | Roster with live status.                                                                                                                                                         |
| PATCH  | `/api/v1/sessions/:id/seats/:seatId`                 | TENANT_ADMIN        | Update accommodations (`extraTimeSec`), mark `ABSENT`.                                                                                                                           |
| DELETE | `/api/v1/sessions/:id/seats/:seatId`                 | TENANT_ADMIN        | Remove — only pre-start; decrements `usedSeats`.                                                                                                                                 |
| POST   | `/api/v1/sessions/:id/seats/:seatId/regenerate-code` | TENANT_ADMIN        | Invalidate old code, issue a new one (lost/compromised code).                                                                                                                    |

### 5.5 Live session control — the synchronous-start core

This is what makes it a _CD exam_ rather than a self-paced quiz: the invigilator's action is the single source of truth, and every candidate client reacts to server events rather than local timers.

| Method | Path                                              | Roles                          | Purpose                                                                                                                                                      |
| ------ | ------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/api/v1/sessions/:id/sections/:section/start`    | TENANT_ADMIN, STAFF (assigned) | Sets `ExamSessionProgress.status = IN_PROGRESS`, `startedAt = now()`. Writes `SECTION_STARTED` event. **Broadcasts** to every connected seat in the session. |
| POST   | `/api/v1/sessions/:id/sections/:section/pause`    | TENANT_ADMIN, STAFF            | Sets `PAUSED`, `pausedAt = now()`. Broadcasts.                                                                                                               |
| POST   | `/api/v1/sessions/:id/sections/:section/resume`   | TENANT_ADMIN, STAFF            | Accumulates `totalPausedSec += now() - pausedAt`, sets `IN_PROGRESS`. Broadcasts.                                                                            |
| POST   | `/api/v1/sessions/:id/sections/:section/end`      | TENANT_ADMIN, STAFF            | Force-ends the section for everyone still `IN_PROGRESS`; sets their `SectionProgress.status = EXPIRED` or `SUBMITTED` per policy. Broadcasts.                |
| POST   | `/api/v1/sessions/:id/seats/:seatId/force-submit` | TENANT_ADMIN, STAFF            | Submit a single candidate's current section early (e.g. suspected misconduct). Logs `SEAT_FORCE_SUBMITTED`.                                                  |
| POST   | `/api/v1/sessions/:id/seats/:seatId/extend-time`  | TENANT_ADMIN, STAFF            | `{ extraSec }` — adjusts `ExamSeat.extraTimeSec`. Logs `SEAT_TIME_EXTENDED`. See the scope caveat in §8.                                                     |
| GET    | `/api/v1/sessions/:id/live`                       | TENANT_ADMIN, STAFF            | Live dashboard: per-section progress, per-seat status, submission counts, connection state (from ephemeral store, see §6).                                   |
| GET    | `/api/v1/sessions/:id/events`                     | TENANT_ADMIN, STAFF            | Audit trail, filterable by section/seat/type.                                                                                                                |
| POST   | `/api/v1/sessions/:id/events`                     | TENANT_ADMIN, STAFF            | Manual `NOTE` event (incident log).                                                                                                                          |

### 5.6 Scoring

| Method | Path                           | Roles               | Purpose                                                                                            |
| ------ | ------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/seats/:seatId/scores` | TENANT_ADMIN, STAFF | `{ section, rawScore?, bandScore?, notes? }`. `scoredBy = null` for auto-graded Listening/Reading. |
| GET    | `/api/v1/sessions/:id/scores`  | TENANT_ADMIN, STAFF | Full roster of results for a sitting.                                                              |
| GET    | `/api/v1/seats/:seatId/scores` | TENANT_ADMIN, STAFF | One candidate's results across sections.                                                           |

---

## 6. Candidate (Seat-Scoped) API

Everything here requires a **seat JWT** and is implicitly scoped to that one `seatId`/`sessionId` — no seat can ever address another seat's resources, enforced at the query layer, not just the route layer.

| Method | Path                                            | Purpose                                                                                                                                                                                                                    |
| ------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/v1/seat/session`                          | Current state: section, status, `serverTime`, `startedAt`, `plannedDurationSec`, `extraTimeSec`, `totalPausedSec`, and a server-computed `remainingSec`. Client polls this on load/reconnect — never trusts its own clock. |
| WS     | `/api/v1/seat/stream`                           | Live push channel (see §7): `SECTION_STARTED`, `SECTION_PAUSED`, `SECTION_RESUMED`, `SECTION_ENDED`, `SEAT_TIME_EXTENDED`, `SESSION_CANCELLED`.                                                                            |
| GET    | `/api/v1/seat/sections/:section/questions`      | Fetch the section's question content from the external JSON store. Only unlocked while that section is `IN_PROGRESS`.                                                                                                      |
| PUT    | `/api/v1/seat/questions/:questionId/answer`     | Autosave: `{ value, wordCount?, expectedVersion }`. Optimistic-locked on `Answer.version`; `409` on conflict returns the latest server value.                                                                              |
| POST   | `/api/v1/seat/questions/:questionId/visit`      | Marks `visitedAt` (navigation tracking, review-screen indicators).                                                                                                                                                         |
| POST   | `/api/v1/seat/questions/:questionId/flag`       | Toggle `isFlagged` ("review later" marker).                                                                                                                                                                                |
| POST   | `/api/v1/seat/questions/:questionId/highlights` | Reading only — `{ startOffset, endOffset, color? }`.                                                                                                                                                                       |
| DELETE | `/api/v1/seat/highlights/:id`                   | Remove a highlight.                                                                                                                                                                                                        |
| POST   | `/api/v1/seat/questions/:questionId/draft`      | Writing only — appends a `WritingDraft` snapshot tick (distinct from the canonical `Answer`; this is the recovery/replay trail).                                                                                           |
| POST   | `/api/v1/seat/sections/:section/submit`         | Candidate submits early, before time runs out.                                                                                                                                                                             |

---

## 7. Real-Time Sync Design

The whole "everyone's Listening starts at the same second" requirement lives here, not in the REST layer.

- **Transport:** WebSocket (or SSE if you want simpler infra and don't need candidate→server pushes beyond the REST calls above). One channel per session: `session:{sessionId}`. Both candidate clients and the invigilator dashboard subscribe to it.
- **Server is the only clock that matters.** Clients never compute "time's up" from their own timers alone — they display a countdown derived from `serverTime` fetched via `GET /seat/session`, and re-sync periodically (e.g. every 30s) plus on every push event, so clock drift or a slow client never causes an early/late submit.
- **Fan-out on invigilator action:** `POST .../sections/:section/start` does, inside one transaction: update `ExamSessionProgress` → write `ExamSessionEvent` → publish to the session's pub/sub channel (Redis pub/sub, or Postgres `LISTEN/NOTIFY` if you want to avoid an extra infra piece) → your WS layer relays to every connected socket in that room.
- **Reconnect handling:** if a candidate's socket drops mid-section, nothing breaks — on reconnect, the client just calls `GET /seat/session` again and gets correct state, because remaining time is _derived_, never stored per-seat (exactly as your schema comment on `SectionProgress` says).
- **Auto-submit is a scheduled job, not a client promise.** When a section starts, schedule a delayed job (BullMQ/Redis, or a lightweight poller) per seat at `startedAt + plannedDurationSec + extraTimeSec - totalPausedSec`. The job force-transitions any seat still `IN_PROGRESS` to `SUBMITTED`/`EXPIRED`. Never rely on the candidate's browser to submit itself at zero.
- **Connection liveness for the invigilator dashboard:** your schema comment already flags this correctly — don't add a mutable "last seen" field. Keep short-lived heartbeats in an ephemeral store (Redis key with TTL, not Postgres), and only write a durable `ExamSessionEvent` (`SEAT_DISCONNECTED`/reconnected, if you add those event types) when a disconnect crosses a real threshold (e.g. >15s), so the audit log doesn't fill with a row every heartbeat tick.

---

## 8. End-to-End Flows

**A. Tenant Admin schedules a sitting**
`POST /tests` (or pick from shared library) → `PUT /tests/:id/sections` → `POST /sessions` (snapshots section configs) → `POST /sessions/:id/seats` × N (quota-checked) → `POST /sessions/:id/invigilators`.

**B. Invigilator runs exam day**
Login → `GET /sessions?status=SCHEDULED` → open session → `GET /sessions/:id/live` (dashboard, subscribes to WS) → `POST .../sections/LISTENING/start` → watch live progress → `.../pause`/`.../resume` as needed → `.../end` → repeat per section → `POST /seats/:id/scores` once results are in.

**C. Candidate takes the exam**
`POST /seat/login` with access code → seat JWT → `GET /seat/session` (probably `NOT_STARTED`, waiting screen) → WS connects, waits → receives `SECTION_STARTED` → `GET /seat/sections/LISTENING/questions` → answer/flag/highlight/autosave calls throughout → section ends (either candidate `POST .../submit` or server auto-submit job) → waits for next `SECTION_STARTED` push → repeat.

---

## 9. Notes on the Schema (things to confirm before building)

1. **Candidate identity, revisited (§1):** confirm whether candidates are truly one-off (access code only) or need persistent accounts across sittings. Changes the seat-login flow materially.
2. **`extraTimeSec` is seat-wide, not per-section.** If an invigilator extends time mid-Reading because of a technical glitch, that same extra time currently also applies to Writing/Speaking unless you add per-section overrides. Worth deciding if that's intended accommodation semantics or a bug waiting to happen.
3. **`createdBy`/`actorUserId` are soft references (no FK)** by design, for audit-survives-deactivation reasons — just make sure the app layer always resolves and displays a name/email at write time (denormalize into `metadata` if useful), since a dangling `userId` string is only as good as your lookup fallback.
4. **`TenantSeatUsage.version`** is optimistic locking — seat creation/deletion must read-check-write with retry-on-conflict (or wrap in `SELECT ... FOR UPDATE` if you'd rather trade a bit of concurrency for simplicity, though that diverges from what the field implies).
5. **Connection-liveness modeling** — already flagged in your own schema comment; the Redis-heartbeat-plus-thresholded-event approach in §7 respects that intent.

---

_Conventions not detailed above: standard `/api/v1` prefix, cursor or offset pagination on list endpoints, JSON:API-ish error shape (`{ error: { code, message } }`), and idempotency keys on the seat-facing POST endpoints (autosave, submit) so a flaky kiosk network doesn't double-submit._
