import z from 'zod';

import { ClimbGrade } from '../../common/climbs/grades.ts';
import { Climb } from './climb.ts';

export type ClimbsGetQuery = {
  grade?: ClimbGrade[];
  limit?: number;
  cursor?: string;
  locationId?: string;
  search?: string;
};
export const climbsGetQuerySchema = z.object({
  grade: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  locationId: z.string().optional(),
  search: z.string().optional(),
});

export type ClimbsGetResponse = {
  climbs: Climb[];
  nextCursor: string | null;
};
