import { MODEL_3D_STATUSES } from '@jrposada/fit-log-shared/common/model-3d/model-3d-statuses';
import { locationsPutRequestSchema } from '@jrposada/fit-log-shared/models/locations/locations-put';
import { sectorsPutRequestSchema } from '@jrposada/fit-log-shared/models/sectors/sectors-put';
import z from 'zod';

const sectorsFormDataSchema = sectorsPutRequestSchema
  .omit({ images: true, models3d: true })
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
    models3d: z.array(
      z.object({
        id: z.string().optional(),
        status: z.enum(MODEL_3D_STATUSES).optional(),
        error: z.string().optional(),
        _status: z.enum(['active', 'deleted', 'new']).optional(),
        _tempId: z.string().optional(),
        /** Which endpoint a pending ('new') entry should upload through. */
        kind: z.enum(['video', 'model']).optional(),
        base64: z.string().optional(),
        mimeType: z.string().optional(),
        filename: z.string().optional(),
      })
    ),
  });

export const formDataSchema = locationsPutRequestSchema
  .omit({ sectors: true })
  .extend({
    sectors: z.array(sectorsFormDataSchema),
  });
export type FormData = z.infer<typeof formDataSchema>;
