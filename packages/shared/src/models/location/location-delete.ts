import z from 'zod';

export type LocationsDeleteParams = {
  id: string;
};
export const locationsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type LocationsDeleteResponse = undefined;
