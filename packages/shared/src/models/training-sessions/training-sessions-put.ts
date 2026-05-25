import z from 'zod';

import { TrainingSession } from './training-session.ts';

export type TrainingSessionsPutRequest = Omit<
  TrainingSession,
  'id' | 'createdAt' | 'updatedAt' | 'location' | 'climbHistories'
> & {
  id?: string;

  location: string | null;
  climbHistories: string[];
};

export const trainingSessionsPutRequestSchema = z.object({
  id: z.string().optional(),
  title: z.string().nonempty(),
  notes: z.string().optional(),
  startedAt: z.string().nonempty(),
  endedAt: z.string().nonempty().optional(),
  lastActivityAt: z.string().nonempty().optional(),
  location: z.string().nonempty().nullable(),
  climbHistories: z.array(z.string().nonempty()),
});

export type TrainingSessionsPutResponse = {
  trainingSession: TrainingSession;
};
