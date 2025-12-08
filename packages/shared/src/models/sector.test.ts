import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Sector,
  sectorSchema,
  SectorsDeleteParams,
  sectorsDeleteParamsSchema,
  SectorsGetByIdParams,
  sectorsGetByIdParamsSchema,
  SectorsPutRequest,
  sectorsPutRequestSchema,
} from './sector';

export type SectorTest = Expect<
  IsTrue<IsEqual<Sector, z.infer<typeof sectorSchema>>>
>;

export type SectorsPutRequestTest = Expect<
  IsTrue<IsEqual<SectorsPutRequest, z.infer<typeof sectorsPutRequestSchema>>>
>;

export type SectorsDeleteParamsTest = Expect<
  IsTrue<
    IsEqual<SectorsDeleteParams, z.infer<typeof sectorsDeleteParamsSchema>>
  >
>;

export type SectorsGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<SectorsGetByIdParams, z.infer<typeof sectorsGetByIdParamsSchema>>
  >
>;
