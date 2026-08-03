import z from 'zod';

import { TrainingSession } from './training-session.ts';

export type TrainingSessionsGetQuery = {
  limit?: number;
  cursor?: string;
  active?: boolean;
};
export const trainingSessionsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  active: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((value) => value === true || value === 'true')
    .optional(),
});

export type TrainingSessionsGetResponse = {
  trainingSessions: TrainingSession[];
  nextCursor: string | null;
};
