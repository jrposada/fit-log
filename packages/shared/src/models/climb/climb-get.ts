import z from 'zod';

import { Climb } from './climb';

export type ClimbsGetQuery = {
  limit?: number;
  locationId?: string;
};
export const climbsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  locationId: z.string().optional(),
});

export type ClimbsGetResponse = {
  climbs: Climb[];
};
