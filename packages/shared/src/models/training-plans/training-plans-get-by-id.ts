import z from 'zod';

import { TrainingPlan } from './training-plan.ts';

export type TrainingPlansGetByIdParams = {
  id: string;
};
export const trainingPlansGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type TrainingPlansGetByIdResponse = {
  trainingPlan: TrainingPlan;
};
