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
  name: z.string().nonempty(),
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
