import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Sector,
  SectorsByIdGetParams,
  sectorsByIdGetParamsSchema,
  sectorSchema,
  SectorsDeleteParams,
  sectorsDeleteParamsSchema,
  SectorsGetQuery,
  sectorsGetQuerySchema,
  SectorsPutRequest,
  sectorsPutRequestSchema,
  SectorUploadUrlRequest,
  sectorUploadUrlRequestSchema,
} from './sector';

export type SectorTest = Expect<
  IsTrue<IsEqual<Sector, z.infer<typeof sectorSchema>>>
>;

export type SectorsGetQueryTest = Expect<
  IsTrue<IsEqual<SectorsGetQuery, z.infer<typeof sectorsGetQuerySchema>>>
>;

export type SectorsPutRequestTest = Expect<
  IsTrue<IsEqual<SectorsPutRequest, z.infer<typeof sectorsPutRequestSchema>>>
>;

export type SectorsDeleteParamsTest = Expect<
  IsTrue<
    IsEqual<SectorsDeleteParams, z.infer<typeof sectorsDeleteParamsSchema>>
  >
>;

export type SectorsByIdGetParamsTest = Expect<
  IsTrue<
    IsEqual<SectorsByIdGetParams, z.infer<typeof sectorsByIdGetParamsSchema>>
  >
>;

export type SectorUploadUrlRequestTest = Expect<
  IsTrue<
    IsEqual<
      SectorUploadUrlRequest,
      z.infer<typeof sectorUploadUrlRequestSchema>
    >
  >
>;
