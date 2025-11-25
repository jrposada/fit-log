import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import z from 'zod';

////////////
// Models //
////////////

/**
 * Represents a climbing location/gym.
 */
export type Location = {
  /**
   * ID `location#<location-id>`.
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
  latitude?: number;

  /**
   * Longitude coordinate
   */
  longitude?: number;

  /**
   * Formatted address from geocoding
   */
  address?: string;

  /**
   * Place name from map service
   */
  placeName?: string;

  /**
   * Google Place ID
   */
  placeId?: string;

  /**
   * Date when location was last used in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  lastUsedAt?: string;

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
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().optional(),
  placeName: z.string().optional(),
  placeId: z.string().optional(),
  lastUsedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/////////
// GET //
/////////
export type LocationsGetParams = {
  limit?: number;
};
export const locationsGetParamsSchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
});

export type LocationsGetResponse = {
  locations: Location[];
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
};

/////////
// PUT //
/////////
export type LocationsPutRequest = Omit<
  Location,
  'id' | 'createdAt' | 'updatedAt'
> & {
  /**
   * ID `location#<location-id>`.
   */
  id?: string;

  /**
   * Date when location was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt?: string;
};
export const locationsPutRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().optional(),
  placeName: z.string().optional(),
  placeId: z.string().optional(),
  lastUsedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
});

export type LocationsPutResponse = {
  location: Location;
};

////////////
// DELETE //
////////////
export type LocationsDeleteResponse = undefined;

///////////////
// GET by ID //
///////////////
export type LocationsGetByIdResponse = {
  location: Location;
};
