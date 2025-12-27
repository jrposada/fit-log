import z from 'zod';

import { Workout } from './workout';

export type WorkoutsGetByIdParams = {
  id: string;
};
export const workoutsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type WorkoutsGetByIdResponse = {
  workout: Workout;
};
