import z from 'zod';

import { HOLD_TYPES } from '../../common/climbs/holds.ts';
import { Climb } from './climb.ts';

const holdSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  radius: z.number().min(0.01).max(0.15),
  type: z.enum(HOLD_TYPES),
});

const splinePointSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export type ClimbsPutRequest = Omit<
  Climb,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'image'
  | 'location'
  | 'sector'
  | 'model3d'
  | 'owner'
  | 'collaborators'
> & {
  id?: string;

  image?: string | null;
  location: string;
  sector: string;
  model3d?: string | null;
};
export const climbsPutRequestSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().nonempty(),
    grade: z.string().nonempty(),
    description: z.string().optional(),
    holds: z.array(holdSchema),
    spline: z.array(splinePointSchema),

    image: z.string().nonempty().nullable().optional(),
    location: z.string().nonempty(),
    sector: z.string().nonempty(),
    model3d: z.string().nonempty().nullable().optional(),
  })
  .refine((data) => Boolean(data.image) || Boolean(data.model3d), {
    message: 'A climb requires either an image or a 3D model',
    path: ['image'],
  });

export type ClimbsPutResponse = {
  climb: Climb;
};
