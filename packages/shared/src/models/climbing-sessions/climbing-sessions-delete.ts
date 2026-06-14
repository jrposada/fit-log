import z from 'zod';

export type ClimbingSessionsDeleteParams = {
  id: string;
};
export const climbingSessionsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbingSessionsDeleteResponse = undefined;
