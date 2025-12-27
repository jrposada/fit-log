import z from 'zod';

import { Climb, climbSchema } from './climb/climb';
import { Image, imageSchema } from './image';

////////////
// Models //
////////////
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

/////////
// PUT //
/////////
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

////////////////////
// BATCH PUT //
////////////////////
export type SectorsBatchPutRequest = {
  sectors: SectorsPutRequest[];
};
export const sectorsBatchPutRequestSchema = z.object({
  sectors: z.array(sectorsPutRequestSchema).min(1),
});

export type SectorsBatchPutResponse = {
  sectors: Sector[];
};

////////////
// DELETE //
////////////
export type SectorsDeleteParams = {
  id: string;
};
export const sectorsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SectorsDeleteResponse = undefined;

////////////////////
// BATCH DELETE //
////////////////////
export type SectorsBatchDeleteRequest = {
  ids: string[];
};
export const sectorsBatchDeleteRequestSchema = z.object({
  ids: z.array(z.string().nonempty()).min(1),
});

export type SectorsBatchDeleteResponse = {
  deletedCount: number;
};

//////////////
// GET BY ID //
///////////////
export type SectorsGetByIdParams = {
  id: string;
};
export const sectorsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SectorsGetByIdResponse = {
  sector: Sector;
};
