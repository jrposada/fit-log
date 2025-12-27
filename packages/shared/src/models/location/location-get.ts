import z from 'zod';

import { Location } from './location';

export type LocationsGetQuery = {
  limit?: number;
};
export const locationsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
});

export type LocationsGetResponse = {
  locations: Location[];
};
