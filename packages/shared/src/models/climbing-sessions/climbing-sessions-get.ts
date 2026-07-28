import z from 'zod';

import { ClimbingSession } from './climbing-session.ts';

export type ClimbingSessionsGetQuery = {
  limit?: number;
  cursor?: string;
  active?: boolean;
};
export const climbingSessionsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  active: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((value) => value === true || value === 'true')
    .optional(),
});

export type ClimbingSessionsGetResponse = {
  climbingSessions: ClimbingSession[];
  nextCursor: string | null;
};
