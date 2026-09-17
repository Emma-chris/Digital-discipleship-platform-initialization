import { z } from 'zod';
import { ErrorCode } from '../constants/errors.js';

export const idSchema = z.string().uuid('Invalid identifier');
export type IdInput = z.infer<typeof idSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationInput = z.infer<typeof paginationSchema>;

/** Working draft of the documented API error shape, validated at runtime. */
export const apiErrorShapeSchema = z.object({
  success: z.literal(false),
  code: z.nativeEnum(ErrorCode),
  message: z.string(),
  details: z.unknown().optional(),
});

/** Lessons list endpoint may filter by course. */
export const lessonsQuerySchema = paginationSchema.extend({
  courseId: z.string().uuid().optional(),
});
export type LessonsQueryInput = z.infer<typeof lessonsQuerySchema>;