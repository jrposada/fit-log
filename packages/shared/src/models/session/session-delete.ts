import z from 'zod';

export type SessionsDeleteParams = {
  id: string;
};
export const sessionsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SessionsDeleteResponse = undefined;
