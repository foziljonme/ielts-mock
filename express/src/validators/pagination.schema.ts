import { z } from 'zod';

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform(v => Number(v ?? 1))
    .refine(v => v >= 1, { message: 'page must be >= 1' }),

  pageSize: z
    .string()
    .optional()
    .transform(v => Number(v ?? 20))
    .refine(v => v >= 1 && v <= 100, {
      message: 'pageSize must be between 1 and 100',
    }),
});
