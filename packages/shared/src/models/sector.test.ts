import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Sector,
  sectorSchema,
  SectorsGetParams,
  sectorsGetParamsSchema,
  SectorsPutRequest,
  sectorsPutRequestSchema,
} from './sector';

export type SectorTest = Expect<
  IsTrue<IsEqual<Sector, z.infer<typeof sectorSchema>>>
>;

export type SectorsGetParamsTest = Expect<
  IsTrue<IsEqual<SectorsGetParams, z.infer<typeof sectorsGetParamsSchema>>>
>;

export type SectorsPutRequestTest = Expect<
  IsTrue<IsEqual<SectorsPutRequest, z.infer<typeof sectorsPutRequestSchema>>>
>;
