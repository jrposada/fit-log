import z from 'zod';

import { Climb, ClimbGrade } from './climb';

export type ClimbsGetQuery = {
  grade?: ClimbGrade[];
  limit?: number;
  locationId?: string;
  search?: string;
};
export const climbsGetQuerySchema = z.object({
  grade: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val]))
    .optional(),
  limit: z.coerce.number().int().positive().optional(),
  locationId: z.string().optional(),
  search: z.string().optional(),
});

export type ClimbsGetResponse = {
  climbs: Climb[];
};
