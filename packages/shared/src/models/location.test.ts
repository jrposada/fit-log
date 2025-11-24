import z from 'zod';
import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Location,
  locationSchema,
  LocationsGetParams,
  locationsGetParamsSchema,
} from './location';

export type LocationTest = Expect<
  IsTrue<IsEqual<Location, z.infer<typeof locationSchema>>>
>;

export type LocationsGetParamsTest = Expect<
  IsTrue<IsEqual<LocationsGetParams, z.infer<typeof locationsGetParamsSchema>>>
>;
