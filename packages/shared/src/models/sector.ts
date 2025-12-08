import z from 'zod';

////////////
// Models //
////////////

/**
 * Represents a sector/wall within a climbing location.
 */
export type Sector = {
  /**
   * ID
   */
  id: string;

  /**
   * Name of the sector
   */
  name: string;

  /**
   * Description of the sector
   */
  description?: string;

  /**
   * Whether this is the primary sector for the location
   */
  isPrimary: boolean;

  /**
   * Location latitude
   */
  latitude: number;

  /**
   * Location longitude
   */
  longitude: number;

  /**
   * Google Maps place ID
   */
  googleMapsId?: string;

  /**
   * Sector's images ID
   */
  images: string[];

  /**
   * Sector's climbs ID
   */
  climbs: string[];

  /**
   * Date when sector was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt: string;

  /**
   * Date when sector was last updated in ISO 8601 format (UTC).
   *
   * @format date-time
   */
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

  images: z.array(z.string().nonempty()),
  climbs: z.array(z.string().nonempty()),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/////////
// GET //
/////////

/////////
// PUT //
/////////
export type SectorsPutRequest = Omit<
  Sector,
  'id' | 'createdAt' | 'updatedAt'
> & {
  /**
   * ID
   */
  id?: string;
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
