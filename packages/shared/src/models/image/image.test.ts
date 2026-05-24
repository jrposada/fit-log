import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import { ImagesPostRequest, imagesPostRequestSchema } from './image-post.ts';

export type ImagesPostRequestTest = Expect<
  IsTrue<IsEqual<ImagesPostRequest, z.infer<typeof imagesPostRequestSchema>>>
>;
