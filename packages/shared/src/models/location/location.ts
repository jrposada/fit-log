import z from 'zod';

import { Sector, sectorSchema } from '../sector';

export type Location = {
  /* Data */
  id: string;
  name: string;
  description?: string;

  latitude: number;
  longitude: number;
  googleMapsId?: string;

  /* References */
  sectors: Sector[];

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};
export const locationSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),

  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googleMapsId: z.string().optional(),

  sectors: z.array(sectorSchema),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
