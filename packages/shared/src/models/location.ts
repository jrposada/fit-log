import z from 'zod';

////////////
// Models //
////////////

/**
 * Represents a climbing location/gym.
 */
export type Location = {
  /**
   * ID
   */
  id: string;

  /**
   * Name of the location
   */
  name: string;

  /**
   * Description of the location
   */
  description?: string;

  /**
   * Latitude coordinate
   */
  latitude: number;

  /**
   * Longitude coordinate
   */
  longitude: number;

  /**
   * Google Maps Place ID
   */
  googleMapsId?: string;

  /**
   * Sectors associated with this location
   */
  sectors: string[];

  /**
   * Date when location was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt: string;

  /**
   * Date when location was last updated in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  updatedAt: string;
};
export const locationSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),

  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googleMapsId: z.string().optional(),

  sectors: z.array(z.string()),

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
  'id' | 'createdAt' | 'updatedAt'
> & {
  /**
   * ID
   */
  id?: string;
};
export const locationsPutRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),

  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  googleMapsId: z.string().optional(),

  sectors: z.array(z.string()),
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
