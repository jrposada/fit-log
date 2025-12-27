import z from 'zod';

import { Climb, holdSchema } from './climb';

export type ClimbsPutRequest = Omit<Climb, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};
export const climbsPutRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty(),
  grade: z.string().nonempty(),
  description: z.string().optional(),
  holds: z.array(holdSchema),

  image: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),
});

export type ClimbsPutResponse = {
  climb: Climb;
};
