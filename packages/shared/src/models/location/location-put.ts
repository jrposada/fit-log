import z from 'zod';

import { Location } from './location';

export type LocationsPutRequest = Omit<
  Location,
  'id' | 'createdAt' | 'updatedAt' | 'sectors'
> & {
  id?: string;

  sectors: string[];
};
export const locationsPutRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),

  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googleMapsId: z.string().optional(),

  sectors: z.array(z.string().nonempty()),
});

export type LocationsPutResponse = {
  location: Location;
};
