import z from 'zod';

import { Expect } from '../../types/expect';
import { IsEqual } from '../../types/is-equal';
import { IsTrue } from '../../types/is-true';
import {
  SectorsDeleteParams,
  sectorsDeleteParamsSchema,
} from './sector-delete';
import {
  SectorsGetByIdParams,
  sectorsGetByIdParamsSchema,
} from './sector-get-by-id';
import { SectorsPutRequest, sectorsPutRequestSchema } from './sector-put';

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
