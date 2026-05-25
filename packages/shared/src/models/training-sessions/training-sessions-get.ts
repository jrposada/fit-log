import z from 'zod';

import { TrainingSession } from './training-session.ts';

export type TrainingSessionsGetQuery = {
  limit?: number;
};
export const trainingSessionsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
});

export type TrainingSessionsGetResponse = {
  trainingSessions: TrainingSession[];
};
