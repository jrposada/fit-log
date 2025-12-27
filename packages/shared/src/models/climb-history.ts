import z from 'zod';

import { Climb, climbSchema } from './climb';
import { Location, locationSchema } from './location';
import { Sector, sectorSchema } from './sector';

////////////
// Models //
////////////
export type ClimbHistoryStatus = 'send' | 'flash' | 'attempt' | 'project';

export type ClimbHistory = {
  /* Data */
  id: string;
  status: ClimbHistoryStatus;
  attempts?: number;
  notes?: string;

  /* References */
  climb: Climb;
  location: Location;
  sector: Sector;

  /* Timestamps */
  createdAt: string;
  updatedAt: string;
};

export const climbHistorySchema = z.object({
  id: z.string().nonempty(),
  status: z.enum(['send', 'flash', 'attempt', 'project']),
  attempts: z.number().int().positive().optional(),
  notes: z.string().optional(),

  climb: climbSchema,
  location: locationSchema,
  sector: sectorSchema,

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
  'id' | 'createdAt' | 'updatedAt' | 'climb' | 'location' | 'sector'
> & {
  id?: string;

  climb: string;
  location: string;
  sector: string;
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
