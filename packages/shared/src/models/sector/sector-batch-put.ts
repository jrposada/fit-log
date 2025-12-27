import z from 'zod';

import { Sector } from './sector';
import { SectorsPutRequest, sectorsPutRequestSchema } from './sector-put';

export type SectorsBatchPutRequest = {
  sectors: SectorsPutRequest[];
};
export const sectorsBatchPutRequestSchema = z.object({
  sectors: z.array(sectorsPutRequestSchema).min(1),
});

export type SectorsBatchPutResponse = {
  sectors: Sector[];
};
