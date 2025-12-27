import z from 'zod';

import { Session } from './session';

export type SessionsPutRequest = Omit<
  Session,
  'id' | 'createdAt' | 'updatedAt'
> & {
  id?: string;
};
export const sessionsPutRequestSchema = z.object({
  id: z.string().optional(),
  completedAt: z.string().datetime(),
});

export type SessionsPutResponse = {
  session: Session;
};
