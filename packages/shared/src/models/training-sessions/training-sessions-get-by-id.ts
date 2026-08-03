import z from 'zod';

import { TrainingSession } from './training-session.ts';

export type TrainingSessionsGetByIdParams = {
  id: string;
};
export const trainingSessionsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type TrainingSessionsGetByIdResponse = {
  trainingSession: TrainingSession;
};
