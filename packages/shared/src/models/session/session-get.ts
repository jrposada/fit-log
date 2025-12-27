import z from 'zod';

import { Session } from './session';

export type SessionsGetQuery = {
  limit?: number;
};
export const sessionsGetQuerySchema = z.object({
  limit: z.number().int().positive().optional(),
});

export type SessionsGetResponse = {
  sessions: Session[];
};
