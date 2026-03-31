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
        id: z.string().optional(),
        imageUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        imageWidth: z.number().optional(),
        imageHeight: z.number().optional(),
        _status: z.enum(['active', 'deleted', 'new']).optional(),
        _tempId: z.string().optional(),
        base64: z.string().optional(),
        mimeType: z.string().optional(),
        uri: z.string().optional(),
      })
    ),
  });

export const formDataSchema = locationsPutRequestSchema
  .omit({ sectors: true })
  .extend({
    sectors: z.array(sectorsFormDataSchema),
  });
export type FormData = z.infer<typeof formDataSchema>;
