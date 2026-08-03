import z from 'zod';

export type TrainingSessionsDeleteParams = {
  id: string;
};
export const trainingSessionsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type TrainingSessionsDeleteResponse = undefined;
