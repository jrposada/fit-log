import z from 'zod';

export type ClimbHistoriesDeleteParams = {
  id: string;
};

export const climbHistoriesDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbHistoriesDeleteResponse = undefined;
