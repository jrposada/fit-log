import z from 'zod';

////////////
// Models //
////////////

/**
 * Status of a climb attempt
 */
export type ClimbHistoryStatus = 'send' | 'flash' | 'attempt' | 'project';

/**
 * Represents a climb history entry
 */
export type ClimbHistory = {
  /**
   * ID
   */
  id: string;

  /**
   * Status of the climb
   */
  status: ClimbHistoryStatus;

  /**
   * Number of attempts
   */
  attempts?: number;

  /**
   * Free text notes
   */
  notes?: string;

  /**
   * Climb reference
   */
  climb: string;

  /**
   * Location reference (denormalized from climb)
   */
  location: string;

  /**
   * Sector reference (denormalized from climb)
   */
  sector: string;

  /**
   * Date when history entry was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt: string;

  /**
   * Date when history entry was last updated in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  updatedAt: string;
};

export const climbHistorySchema = z.object({
  id: z.string().nonempty(),
  status: z.enum(['send', 'flash', 'attempt', 'project']),
  attempts: z.number().int().positive().optional(),
  notes: z.string().optional(),

  climb: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/////////
// GET //
/////////
export type ClimbHistoriesGetQuery = {
  limit?: number;
  climbId?: string;
  locationId?: string;
  sectorId?: string;
  status?: ClimbHistoryStatus;
  startDate?: string;
  endDate?: string;
};

export const climbHistoriesGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  climbId: z.string().optional(),
  locationId: z.string().optional(),
  sectorId: z.string().optional(),
  status: z.enum(['send', 'flash', 'attempt', 'project']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type ClimbHistoriesGetResponse = {
  climbHistories: ClimbHistory[];
};

/////////
// PUT //
/////////
export type ClimbHistoriesPutRequest = Omit<
  ClimbHistory,
  'id' | 'createdAt' | 'updatedAt'
> & {
  /**
   * ID
   */
  id?: string;
};

export const climbHistoriesPutRequestSchema = z.object({
  id: z.string().optional(),
  status: z.enum(['send', 'flash', 'attempt', 'project']),
  attempts: z.number().int().positive().optional(),
  notes: z.string().optional(),

  climb: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),
});

export type ClimbHistoriesPutResponse = {
  climbHistory: ClimbHistory;
};

////////////
// DELETE //
////////////
export type ClimbHistoriesDeleteParams = {
  id: string;
};

export const climbHistoriesDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbHistoriesDeleteResponse = undefined;

///////////////
// GET by ID //
///////////////
export type ClimbHistoriesGetByIdParams = {
  id: string;
};

export const climbHistoriesGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbHistoriesGetByIdResponse = {
  climbHistory: ClimbHistory;
};
