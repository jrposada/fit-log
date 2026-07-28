import z from 'zod';

import { Location } from './location.ts';

export type LocationsGetQuery = {
  limit?: number;
  cursor?: string;
};
export const locationsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
});

export type LocationsGetResponse = {
  locations: Location[];
  nextCursor: string | null;
};
