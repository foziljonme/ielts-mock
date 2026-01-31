import { z } from 'zod';

export const createExamSeatSchema = z.object({
  candidateName: z.string(),
  candidateContact: z.string(),
  label: z.string().optional(),
});

export type CreateExamSeatSchema = z.infer<typeof createExamSeatSchema>;
