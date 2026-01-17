// model ExamSeat {
//   id               String         @id @default(cuid())
//   sessionId        String
//   seatNumber       Int
//   label            String // "Row 3, Seat 2"
//   accessCode       String         @unique // Candidate login code
//   candidateName    String
//   candidateId      String
//   candidateContact String
//   status           ExamSeatStatus @default(NOT_STARTED)
//   startedAt        DateTime?
//   submittedAt      DateTime?

//   session  ExamSession       @relation(fields: [sessionId], references: [id])
//   sections SectionProgress[]

//   @@unique([sessionId, seatNumber])
// }
import { z } from 'zod'

export const createExamSeatSchema = z.object({
  tenantId: z.string(),
  seatNumber: z.number(),
  label: z.string(),
  candidateName: z.string(),
  candidateContact: z.string(),
})

export type CreateExamSeatSchema = z.infer<typeof createExamSeatSchema>
