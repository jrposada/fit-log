import z from 'zod';

export type WorkoutsDeleteParams = {
  id: string;
};
export const workoutsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type WorkoutsDeleteResponse = undefined;
