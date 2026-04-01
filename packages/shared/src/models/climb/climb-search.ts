import z from 'zod';

import { ClimbHistoryStatus } from '../climb-history/climb-history';
import { Climb, ClimbGrade } from './climb';

export type ClimbsSearchQuery = {
  attempts?: number;
  grade?: ClimbGrade[];
  limit?: number;
  locationId?: string;
  search?: string;
  status?: ClimbHistoryStatus | 'project';
};

export const climbsSearchQuerySchema = z.object({
  attempts: z.coerce.number().int().min(0).optional(),
  grade: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),
  limit: z.coerce.number().int().positive().optional(),
  locationId: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['send', 'flash', 'attempt', 'project']).optional(),
});

export type ClimbSearchResult = Climb & {
  userStatus?: {
    status: ClimbHistoryStatus;
    isProject: boolean;
    attempts?: number;
    lastTriedDate?: string;
  };
};

export type ClimbsSearchResponse = {
  climbs: ClimbSearchResult[];
};
