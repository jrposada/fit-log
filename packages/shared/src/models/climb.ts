import z from 'zod';

////////////
// Models //
////////////

export type ClimbGrade =
  | 'V0'
  | 'V1'
  | 'V2'
  | 'V3'
  | 'V4'
  | 'V5'
  | 'V6'
  | 'V7'
  | 'V8'
  | 'V9'
  | 'V10'
  | 'V11'
  | 'V12'
  | 'V13'
  | 'V14'
  | 'V15'
  | 'V16'
  | 'V17'
  | (string & {});

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
   * ID
   */
  id: string;

  /**
   * Name/title for the climb
   */
  name: string;

  /**
   * Grade of the climb (e.g., V0, V1, 5.10a)
   */
  grade: ClimbGrade;

  /**
   * Description or notes
   */
  description?: string;

  /**
   * Array of holds marking the route
   */
  holds: Hold[];

  /**
   * Image
   */
  image: string;

  /**
   * Location
   */
  location: string;

  /**
   * Sector
   */
  sector: string;

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
  name: z.string().nonempty(),
  grade: z.string().nonempty(),
  description: z.string().optional(),
  holds: z.array(holdSchema),

  image: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/////////
// GET //
/////////
export type ClimbsGetQuery = {
  limit?: number;
};
export const climbsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
});

export type ClimbsGetResponse = {
  climbs: Climb[];
};

/////////
// PUT //
/////////
export type ClimbsPutRequest = Omit<Climb, 'id' | 'createdAt' | 'updatedAt'> & {
  /**
   * ID
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
  name: z.string().nonempty(),
  grade: z.string().nonempty(),
  description: z.string().optional(),
  holds: z.array(holdSchema),

  image: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),

  createdAt: z.string().datetime().optional(),
});

export type ClimbsPutResponse = {
  climb: Climb;
};

////////////
// DELETE //
////////////
export type ClimbsDeleteParams = {
  id: string;
};
export const climbsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbsDeleteResponse = undefined;

///////////////
// GET by ID //
///////////////
export type ClimbsGetByIdParams = {
  id: string;
};
export const climbsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbsGetByIdResponse = {
  climb: Climb;
};
