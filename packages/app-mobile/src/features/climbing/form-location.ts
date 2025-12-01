import { locationsPutRequestSchema } from '@shared/models/location';
import { sectorsPutRequestSchema } from '@shared/models/sector';
import z from 'zod';

export const formDataSchema = locationsPutRequestSchema
  .omit({ sectors: true })
  .extend({
    sectors: z.array(
      sectorsPutRequestSchema.extend({
        _status: z.enum(['new', 'updated', 'deleted']).optional(),
        _tempId: z.string().optional(),
      })
    ),
  });
export type FormData = z.infer<typeof formDataSchema>;
