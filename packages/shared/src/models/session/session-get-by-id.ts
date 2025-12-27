import z from 'zod';

import { Session } from './session';

export type SessionsGetByIdParams = {
  id: string;
};
export const sessionsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SessionsGetByIdResponse = {
  session: Session;
};
