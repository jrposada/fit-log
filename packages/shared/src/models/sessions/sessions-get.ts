import z from 'zod';

import { Session } from './session.ts';

export type SessionsGetQuery = {
  limit?: number;
  cursor?: string;
};
export const sessionsGetQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
});

export type SessionsGetResponse = {
  sessions: Session[];
  nextCursor: string | null;
};
