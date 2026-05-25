import z from 'zod';

import {
  CLIMB_HISTORY_STATUSES,
  ClimbHistoryStatus,
} from '../../common/climb-histories/climb-history-statuses.ts';

export type ClimbHistoriesPutRequest = {
  tryId?: string;

  status: ClimbHistoryStatus;
  attempts?: number;
  notes?: string;
  date?: string;

  climb: string;
  location: string;
  sector: string;
  trainingSession?: string;

  forced?: boolean;
};

export const climbHistoriesPutRequestSchema = z.object({
  tryId: z.string().optional(),
  status: z.enum(CLIMB_HISTORY_STATUSES),
  attempts: z.number().int().positive().optional(),
  notes: z.string().optional(),
  date: z.string().datetime().optional(),

  climb: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),
  trainingSession: z.string().nonempty().optional(),

  forced: z.boolean().optional(),
});

export type ClimbHistoriesPutResponse = {
  climbHistory: import('./climb-history.ts').ClimbHistory;
};
