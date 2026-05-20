import z from 'zod';

export type Models3dDeleteParams = {
  id: string;
};
export const models3dDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type Models3dDeleteResponse = undefined;
