import { z } from "zod";
import { ExamStatus } from "../../../prisma/generated/client";
import { createExamSeatSchema } from "./seats/seat.schema";

export const createExamSchema = z.object({
  testId: z.string(),
  examDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date string, eg: 2026-01-24T00:00:00Z",
    })
    .transform((val) => new Date(val)),
  status: z.nativeEnum(ExamStatus).default(ExamStatus.SCHEDULED),
  seats: z.array(createExamSeatSchema).optional().default([]),
});

export type CreateExamSchema = z.infer<typeof createExamSchema>;

export const updateExamSchema = createExamSchema
  .partial()
  .omit({ seats: true });

export type UpdateExamSchema = z.infer<typeof createExamSchema>;
