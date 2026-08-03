import z from 'zod';

export type Model3dsDeleteParams = {
  id: string;
};

export const model3dsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type Model3dsDeleteResponse = undefined;
