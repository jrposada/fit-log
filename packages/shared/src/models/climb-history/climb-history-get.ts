import z from 'zod';

import {
  CLIMB_HISTORY_QUERY_STATUSES,
  ClimbHistory,
  ClimbHistoryStatus,
} from './climb-history';

export type ClimbHistoriesGetQueryStatus = ClimbHistoryStatus | 'project';

export type ClimbHistoriesGetQuery = {
  limit?: number;
  cursor?: string;
  climbId?: string;
  locationId?: string;
  sectorId?: string;
  status?: ClimbHistoriesGetQueryStatus[];
  startDate?: string;
  endDate?: string;
};

export const climbHistoriesGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  climbId: z.string().optional(),
  locationId: z.string().optional(),
  sectorId: z.string().optional(),
  status: z
    .union([
      z.enum(CLIMB_HISTORY_QUERY_STATUSES),
      z.array(z.enum(CLIMB_HISTORY_QUERY_STATUSES)),
    ])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type ClimbHistoriesGetResponse = {
  climbHistories: ClimbHistory[];
  nextCursor: string | null;
};
