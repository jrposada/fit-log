import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import z from 'zod';

////////////
// Models //
////////////

/**
 * Represents a hold position on a climbing problem.
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
 * Represents a climbing problem.
 */
export type Climb = {
  /**
   * ID `climb#<user-id>#<climb-id>`.
   */
  id: string;

  /**
   * Array of holds marking the route
   */
  holds: Hold[];

  /**
   * Name/title for the climb
   */
  name: string;

  /**
   * Description or notes
   */
  description?: string;

  /**
   * Date when climb was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt: string;

  /**
   * Date when climb was last updated in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  updatedAt: string;
};
export const climbSchema = z.object({
  id: z.string().nonempty(),
  holds: z.array(holdSchema),
  name: z.string().nonempty(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/////////
// GET //
/////////
export type ClimbsGetResponse = {
  climbs: Climb[];
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
};

/////////
// PUT //
/////////
export type ClimbsPutRequest = Omit<Climb, 'id' | 'createdAt' | 'updatedAt'> & {
  /**
   * ID `climb#<user-id>#<climb-id>`.
   */
  id?: string;

  /**
   * Date when climb was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt?: string;
};
export const climbsPutRequestSchema = z.object({
  id: z.string().optional(),
  holds: z.array(holdSchema),
  name: z.string().nonempty(),
  description: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});

export type ClimbsPutResponse = {
  climb: Climb;
};

////////////
// DELETE //
////////////
export type ClimbsDeleteResponse = undefined;

///////////////
// GET by ID //
///////////////
export type ClimbsGetByIdResponse = {
  climb: Climb;
};
