import { climbSchema } from '@shared/models/climb';
import { imageSchema } from '@shared/models/image';
import { locationsPutRequestSchema } from '@shared/models/location';
import { sectorsPutRequestSchema } from '@shared/models/sector';
import z from 'zod';

const sectorsFormDataSchema = sectorsPutRequestSchema
  .omit({ images: true, climbs: true })
  .extend({
    _status: z.enum(['new', 'updated', 'deleted']).optional(),
    _tempId: z.string().optional(),
    images: z.array(imageSchema),
    climbs: z.array(climbSchema),
  });

export const formDataSchema = locationsPutRequestSchema
  .omit({ sectors: true })
  .extend({
    sectors: z.array(sectorsFormDataSchema),
  });
export type FormData = z.infer<typeof formDataSchema>;
