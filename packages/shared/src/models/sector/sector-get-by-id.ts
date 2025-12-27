import z from 'zod';

import { Sector } from './sector';

export type SectorsGetByIdParams = {
  id: string;
};
export const sectorsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SectorsGetByIdResponse = {
  sector: Sector;
};
