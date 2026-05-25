import z from 'zod';

export type SectorsDeleteParams = {
  id: string;
};
export const sectorsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SectorsDeleteResponse = undefined;
