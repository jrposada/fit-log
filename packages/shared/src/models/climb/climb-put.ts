import z from 'zod';

import { Climb } from './climb';

const holdSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  radius: z.number().min(0.01).max(0.15),
});

const splinePointSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export type ClimbsPutRequest = Omit<
  Climb,
  'id' | 'createdAt' | 'updatedAt' | 'image' | 'location' | 'sector'
> & {
  id?: string;

  image: string;
  location: string;
  sector: string;
};
export const climbsPutRequestSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty(),
  grade: z.string().nonempty(),
  description: z.string().optional(),
  holds: z.array(holdSchema),
  spline: z.array(splinePointSchema),

  image: z.string().nonempty(),
  location: z.string().nonempty(),
  sector: z.string().nonempty(),
});

export type ClimbsPutResponse = {
  climb: Climb;
};
