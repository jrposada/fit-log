import z from 'zod';

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

////////////
// Models //
////////////
export type Hold = {
  x: number;
  y: number;
};
export const holdSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export type Climb = {
  /* Data */
  id: string;
  name: string;
  grade: string;
  description?: string;
  holds: Hold[];

  /* References */
  image: string;
  location: string;
  sector: string;

  /* Timestamps */
  createdAt: string;
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
  locationId?: string;
};
export const climbsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  locationId: z.string().optional(),
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
