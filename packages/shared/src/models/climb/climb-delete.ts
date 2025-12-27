import z from 'zod';

export type ClimbsDeleteParams = {
  id: string;
};
export const climbsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbsDeleteResponse = undefined;
