import z from 'zod';

import { Expect } from '../../types/expect';
import { IsEqual } from '../../types/is-equal';
import { IsTrue } from '../../types/is-true';
import { Climb, climbSchema, Hold, holdSchema } from './climb';
import { ClimbsDeleteParams, climbsDeleteParamsSchema } from './climb-delete';
import { ClimbsGetQuery, climbsGetQuerySchema } from './climb-get';
import {
  ClimbsGetByIdParams,
  climbsGetByIdParamsSchema,
} from './climb-get-by-id';
import { ClimbsPutRequest, climbsPutRequestSchema } from './climb-put';

export type HoldTest = Expect<
  IsTrue<IsEqual<Hold, z.infer<typeof holdSchema>>>
>;

export type ClimbTest = Expect<
  IsTrue<IsEqual<Climb, z.infer<typeof climbSchema>>>
>;

export type ClimbsGetQueryTest = Expect<
  IsTrue<IsEqual<ClimbsGetQuery, z.infer<typeof climbsGetQuerySchema>>>
>;

export type ClimbsPutRequestTest = Expect<
  IsTrue<IsEqual<ClimbsPutRequest, z.infer<typeof climbsPutRequestSchema>>>
>;

export type ClimbsDeleteParamsTest = Expect<
  IsTrue<IsEqual<ClimbsDeleteParams, z.infer<typeof climbsDeleteParamsSchema>>>
>;

export type ClimbsGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<ClimbsGetByIdParams, z.infer<typeof climbsGetByIdParamsSchema>>
  >
>;
