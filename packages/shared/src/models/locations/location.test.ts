import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  LocationsDeleteParams,
  locationsDeleteParamsSchema,
} from './locations-delete.ts';
import { LocationsGetQuery, locationsGetQuerySchema } from './locations-get.ts';
import {
  LocationsGetByIdParams,
  locationsGetByIdParamsSchema,
} from './locations-get-by-id.ts';
import {
  LocationsPutRequest,
  locationsPutRequestSchema,
} from './locations-put.ts';

export type LocationsGetQueryTest = Expect<
  IsTrue<IsEqual<LocationsGetQuery, z.infer<typeof locationsGetQuerySchema>>>
>;

export type LocationsPutRequestTest = Expect<
  IsTrue<
    IsEqual<LocationsPutRequest, z.infer<typeof locationsPutRequestSchema>>
  >
>;

export type LocationsDeleteParamsTest = Expect<
  IsTrue<
    IsEqual<LocationsDeleteParams, z.infer<typeof locationsDeleteParamsSchema>>
  >
>;

export type LocationsGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<
      LocationsGetByIdParams,
      z.infer<typeof locationsGetByIdParamsSchema>
    >
  >
>;
