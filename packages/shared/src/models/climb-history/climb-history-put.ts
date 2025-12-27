import z from 'zod';

import { ClimbHistory } from './climb-history';

export type ClimbHistoriesPutRequest = Omit<
  ClimbHistory,
  'id' | 'createdAt' | 'updatedAt' | 'climb' | 'location' | 'sector'
> & {
  id?: string;

  climb: string;
  location: string;
  sector: string;
};

export const climbHistoriesPutRequestSchema = z.object({
  id: z.string().optional(),
  status: z.enum(['send', 'flash', 'attempt', 'project']),
  attempts: z.number().int().positive().optional(),
  notes: z.string().optional(),

  climb: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),
});

export type ClimbHistoriesPutResponse = {
  climbHistory: ClimbHistory;
};
