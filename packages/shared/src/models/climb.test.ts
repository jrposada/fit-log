import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Climb,
  climbSchema,
  ClimbsPutRequest,
  climbsPutRequestSchema,
  Hold,
  holdSchema,
} from './climb';

export type HoldTest = Expect<
  IsTrue<IsEqual<Hold, z.infer<typeof holdSchema>>>
>;

export type ClimbTest = Expect<
  IsTrue<IsEqual<Climb, z.infer<typeof climbSchema>>>
>;

export type ClimbsPutRequestTest = Expect<
  IsTrue<IsEqual<ClimbsPutRequest, z.infer<typeof climbsPutRequestSchema>>>
>;
