import z from 'zod';

import { Sector, sectorSchema } from './sector';

////////////
// Models //
////////////
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

/////////
// GET //
/////////
export type LocationsGetQuery = {
  limit?: number;
};
export const locationsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
});

export type LocationsGetResponse = {
  locations: Location[];
};

/////////
// PUT //
/////////
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

////////////
// DELETE //
////////////
export type LocationsDeleteParams = {
  id: string;
};
export const locationsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});
export type LocationsDeleteResponse = undefined;

///////////////
// GET by ID //
///////////////
export type LocationsGetByIdParams = {
  id: string;
};
export const locationsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type LocationsGetByIdResponse = {
  location: Location;
};
