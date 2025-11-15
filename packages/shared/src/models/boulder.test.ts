import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Boulder,
  boulderSchema,
  BouldersPutRequest,
  bouldersPutRequestSchema,
  Hold,
  holdSchema,
} from './boulder';

export type HoldTest = Expect<
  IsTrue<IsEqual<Hold, z.infer<typeof holdSchema>>>
>;

export type BoulderTest = Expect<
  IsTrue<IsEqual<Boulder, z.infer<typeof boulderSchema>>>
>;

export type BouldersPutRequestTest = Expect<
  IsTrue<IsEqual<BouldersPutRequest, z.infer<typeof bouldersPutRequestSchema>>>
>;
