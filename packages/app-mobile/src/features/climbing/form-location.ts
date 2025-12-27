import { climbSchema } from '@shared/models/climb/climb';
import { imageSchema } from '@shared/models/image/image';
import { locationsPutRequestSchema } from '@shared/models/location/location-put';
import { sectorsPutRequestSchema } from '@shared/models/sector/sector-put';
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
