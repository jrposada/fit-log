import z from 'zod';

import { Climb } from './climb.ts';

export type ClimbsGetByIdParams = {
  id: string;
};
export const climbsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type ClimbsGetByIdResponse = {
  climb: Climb;
};
