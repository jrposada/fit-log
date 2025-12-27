import z from 'zod';

import { Climb, climbSchema } from '../climb/climb';
import { Image, imageSchema } from '../image/image';

export type Sector = {
  /* Data */
  id: string;
  name: string;
  description?: string;
  isPrimary: boolean;

  latitude: number;
  longitude: number;
  googleMapsId?: string;

  /* References */
  images: Image[];
  climbs: Climb[];

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};

export const sectorSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  isPrimary: z.boolean(),

  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googleMapsId: z.string().optional(),

  images: z.array(imageSchema),
  climbs: z.array(climbSchema),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
