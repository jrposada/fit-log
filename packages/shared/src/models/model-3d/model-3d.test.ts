import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  Model3dsPostRequest,
  model3dsPostRequestSchema,
} from './model-3ds-post.ts';

export type Model3dsPostRequestTest = Expect<
  IsTrue<
    IsEqual<Model3dsPostRequest, z.infer<typeof model3dsPostRequestSchema>>
  >
>;
