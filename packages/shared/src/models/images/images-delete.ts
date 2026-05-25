import z from 'zod';

export type ImagesDeleteParams = {
  id: string;
};

export const imagesDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ImagesDeleteResponse = undefined;
