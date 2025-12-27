import z from 'zod';

import { Sector } from './sector';

export type SectorsPutRequest = Omit<
  Sector,
  'id' | 'createdAt' | 'updatedAt' | 'images' | 'climbs'
> & {
  id?: string;

  images: string[];
  climbs: string[];
};
export const sectorsPutRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  isPrimary: z.boolean(),

  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googleMapsId: z.string().optional(),

  images: z.array(z.string().nonempty()),
  climbs: z.array(z.string().nonempty()),
});

export type SectorsPutResponse = {
  sector: Sector;
};
