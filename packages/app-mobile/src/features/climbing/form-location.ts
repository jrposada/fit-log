import { Climb, climbSchema } from '@shared/models/climb';
import { Image, imageSchema } from '@shared/models/image';
import { locationsPutRequestSchema } from '@shared/models/location';
import {
  SectorsPutRequest,
  sectorsPutRequestSchema,
} from '@shared/models/sector';
import z from 'zod';

export type SectorWithChanges = Omit<SectorsPutRequest, 'images' | 'climbs'> & {
  _status?: 'new' | 'updated' | 'deleted';
  _tempId?: string;
  images: Image[];
  climbs: Climb[];
};

export const formDataSchema = locationsPutRequestSchema
  .omit({ sectors: true })
  .extend({
    sectors: z.array(
      sectorsPutRequestSchema.omit({ images: true, climbs: true }).extend({
        _status: z.enum(['new', 'updated', 'deleted']).optional(),
        _tempId: z.string().optional(),
        images: z.array(imageSchema),
        climbs: z.array(climbSchema),
      })
    ),
  });
export type FormData = z.infer<typeof formDataSchema>;
