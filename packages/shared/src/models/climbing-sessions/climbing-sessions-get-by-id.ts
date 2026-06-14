import z from 'zod';

import { ClimbingSession } from './climbing-session.ts';

export type ClimbingSessionsGetByIdParams = {
  id: string;
};
export const climbingSessionsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbingSessionsGetByIdResponse = {
  climbingSession: ClimbingSession;
};
