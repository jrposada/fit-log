import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  SectorsDeleteParams,
  sectorsDeleteParamsSchema,
} from './sectors-delete.ts';
import {
  SectorsGetByIdParams,
  sectorsGetByIdParamsSchema,
} from './sectors-get-by-id.ts';
import { SectorsPutRequest, sectorsPutRequestSchema } from './sectors-put.ts';

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
