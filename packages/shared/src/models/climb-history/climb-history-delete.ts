import z from 'zod';

export type ClimbHistoriesDeleteParams = {
  id: string;
};

export const climbHistoriesDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbHistoriesDeleteQuery = {
  tryId?: string;
};

export const climbHistoriesDeleteQuerySchema = z.object({
  tryId: z.string().optional(),
});

export type ClimbHistoriesDeleteResponse = undefined;
