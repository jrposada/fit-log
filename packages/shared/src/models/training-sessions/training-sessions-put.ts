import z from 'zod';

import { TrainingSession } from './training-session.ts';

export type TrainingSessionsPutRequest = Omit<
  TrainingSession,
  'id' | 'createdAt' | 'updatedAt' | 'location' | 'climbs'
> & {
  id?: string;

  location: string | null;
  climbs: string[];
};

export const trainingSessionsPutRequestSchema = z.object({
  id: z.string().optional(),
  title: z.string().nonempty(),
  notes: z.string().optional(),
  startedAt: z.string().nonempty(),
  endedAt: z.string().nonempty().optional(),
  lastActivityAt: z.string().nonempty().optional(),
  location: z.string().nonempty().nullable(),
  climbs: z.array(z.string().nonempty()),
});

export type TrainingSessionsPutResponse = {
  trainingSession: TrainingSession;
};
