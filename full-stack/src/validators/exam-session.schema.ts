import { z } from 'zod'
import { ExamSessionStatus } from '../../prisma/generated/enums'

// model ExamSession {
//   id        String            @id @default(cuid())
//   tenantId  String
//   testId    String // External JSON test identifier
//   name      String
//   examDate  DateTime
//   status    ExamSessionStatus @default(SCHEDULED)
//   startTime DateTime?
//   endTime   DateTime?
//   createdAt DateTime          @default(now())

//   tenant Tenant     @relation(fields: [tenantId], references: [id])
//   seats  ExamSeat[]
// }

export const createExamSessionSchema = z.object({
  testId: z.string(),
  name: z.string().min(3).max(255),
  examDate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date string, eg: 2026-01-24T00:00:00Z',
    })
    .transform(val => new Date(val)),
  status: z.enum(ExamSessionStatus).default(ExamSessionStatus.SCHEDULED),
})

export type CreateExamSessionSchema = z.infer<typeof createExamSessionSchema>

export const updateExamSessionSchema = createExamSessionSchema
  .partial()
  .omit({})

export type UpdateExamSessionSchema = z.infer<typeof updateExamSessionSchema>
