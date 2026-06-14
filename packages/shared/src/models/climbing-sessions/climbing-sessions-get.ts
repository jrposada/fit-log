import z from 'zod';

import { ClimbingSession } from './climbing-session.ts';

export type ClimbingSessionsGetQuery = {
  limit?: number;
  active?: boolean;
};
export const climbingSessionsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  active: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((value) => value === true || value === 'true')
    .optional(),
});

export type ClimbingSessionsGetResponse = {
  climbingSessions: ClimbingSession[];
};
