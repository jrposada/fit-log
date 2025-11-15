import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import z from 'zod';

////////////
// Models //
////////////

/**
 * Represents a hold position on a boulder problem.
 */
export type Hold = {
  /**
   * X coordinate (percentage of image width, 0-1)
   */
  x: number;

  /**
   * Y coordinate (percentage of image height, 0-1)
   */
  y: number;
};
export const holdSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

/**
 * Represents a boulder problem.
 */
export type Boulder = {
  /**
   * ID `boulder#<user-id>#<boulder-id>`.
   */
  id: string;

  /**
   * URI or base64 encoded image data.
   */
  image: string;

  /**
   * Array of holds marking the route
   */
  holds: Hold[];

  /**
   * Name/title for the boulder
   */
  name: string;

  /**
   * Description or notes
   */
  description?: string;

  /**
   * Date when boulder was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt: string;

  /**
   * Date when boulder was last updated in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  updatedAt: string;
};
export const boulderSchema = z.object({
  id: z.string().nonempty(),
  image: z.string().nonempty(),
  holds: z.array(holdSchema),
  name: z.string().nonempty(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/////////
// GET //
/////////
export type BouldersGetResponse = {
  boulders: Boulder[];
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
};

/////////
// PUT //
/////////
export type BouldersPutRequest = Omit<
  Boulder,
  'id' | 'createdAt' | 'updatedAt'
> & {
  /**
   * ID `boulder#<user-id>#<boulder-id>`.
   */
  id?: string;

  /**
   * Date when boulder was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt?: string;
};
export const bouldersPutRequestSchema = z.object({
  id: z.string().optional(),
  image: z.string().nonempty(),
  holds: z.array(holdSchema),
  name: z.string().nonempty(),
  description: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});

export type BouldersPutResponse = {
  boulder: Boulder;
};

////////////
// DELETE //
////////////
export type BouldersDeleteResponse = undefined;

///////////////
// GET by ID //
///////////////
export type BouldersGetByIdResponse = {
  boulder: Boulder;
};
