import z from 'zod';

import { Expect } from '../../types/expect';
import { IsEqual } from '../../types/is-equal';
import { IsTrue } from '../../types/is-true';
import { ImagesPostRequest, imagesPostRequestSchema } from './image-post';

export type ImagesPostRequestTest = Expect<
  IsTrue<IsEqual<ImagesPostRequest, z.infer<typeof imagesPostRequestSchema>>>
>;
