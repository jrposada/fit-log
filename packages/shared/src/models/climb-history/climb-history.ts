import z from 'zod';

import { Climb, climbSchema } from '../climb/climb';

export type ClimbHistoryStatus = 'send' | 'flash' | 'attempt' | 'project';

export type ClimbHistory = {
  /* Data */
  id: string;
  status: ClimbHistoryStatus;
  attempts?: number;
  notes?: string;

  /* References */
  climb: Climb;
  location: string;
  sector: string;

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};

export const climbHistorySchema = z.object({
  id: z.string().nonempty(),
  status: z.enum(['send', 'flash', 'attempt', 'project']),
  attempts: z.number().int().positive().optional(),
  notes: z.string().optional(),

  climb: climbSchema,
  location: z.string().nonempty(),
  sector: z.string().nonempty(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
