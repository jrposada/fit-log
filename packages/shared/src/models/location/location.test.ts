import z from 'zod';

import { Expect } from '../../types/expect';
import { IsEqual } from '../../types/is-equal';
import { IsTrue } from '../../types/is-true';
import { Location, locationSchema } from './location';
import {
  LocationsDeleteParams,
  locationsDeleteParamsSchema,
} from './location-delete';
import { LocationsGetQuery, locationsGetQuerySchema } from './location-get';
import {
  LocationsGetByIdParams,
  locationsGetByIdParamsSchema,
} from './location-get-by-id';
import { LocationsPutRequest, locationsPutRequestSchema } from './location-put';

export type LocationTest = Expect<
  IsTrue<IsEqual<Location, z.infer<typeof locationSchema>>>
>;

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
