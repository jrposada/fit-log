import z from 'zod';

import { ClimbingSession } from './climbing-session.ts';

export type ClimbingSessionsPutRequest = Omit<
  ClimbingSession,
  'id' | 'createdAt' | 'updatedAt' | 'owner' | 'location' | 'climbHistories'
> & {
  id?: string;

  location: string | null;
  climbHistories: string[];
};

export const climbingSessionsPutRequestSchema = z.object({
  id: z.string().optional(),
  title: z.string().nonempty(),
  notes: z.string().optional(),
  startedAt: z.string().nonempty(),
  endedAt: z.string().nonempty().optional(),
  lastActivityAt: z.string().nonempty().optional(),
  location: z.string().nonempty().nullable(),
  climbHistories: z.array(z.string().nonempty()),
});

export type ClimbingSessionsPutResponse = {
  climbingSession: ClimbingSession;
};
