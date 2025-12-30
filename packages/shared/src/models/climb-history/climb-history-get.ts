import z from 'zod';

import { ClimbHistory, ClimbHistoryStatus } from './climb-history';

export type ClimbHistoriesGetQuery = {
  limit?: number;
  climbId?: string;
  locationId?: string;
  sectorId?: string;
  status?: ClimbHistoryStatus[];
  startDate?: string;
  endDate?: string;
};

export const climbHistoriesGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  climbId: z.string().optional(),
  locationId: z.string().optional(),
  sectorId: z.string().optional(),
  status: z
    .union([
      z.enum(['send', 'flash', 'attempt', 'project']),
      z.array(z.enum(['send', 'flash', 'attempt', 'project'])),
    ])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type ClimbHistoriesGetResponse = {
  climbHistories: ClimbHistory[];
};
