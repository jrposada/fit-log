import { locationsPutRequestSchema } from '@shared/models/location/location-put';
import { sectorsPutRequestSchema } from '@shared/models/sector/sector-put';
import z from 'zod';

const sectorsFormDataSchema = sectorsPutRequestSchema
  .omit({ images: true })
  .extend({
    _status: z.enum(['new', 'updated', 'deleted']).optional(),
    _tempId: z.string().optional(),
    images: z.array(
      z.object({
        id: z.string(),
        imageUrl: z.string().nonempty(),
        thumbnailUrl: z.string().nonempty(),
        imageWidth: z.number(),
        imageHeight: z.number(),
      })
    ),
  });

export const formDataSchema = locationsPutRequestSchema
  .omit({ sectors: true })
  .extend({
    sectors: z.array(sectorsFormDataSchema),
  });
export type FormData = z.infer<typeof formDataSchema>;
