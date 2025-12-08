import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Image,
  imageSchema,
  ImagesPostRequest,
  imagesPostRequestSchema,
} from './image';

export type ImageTest = Expect<
  IsTrue<IsEqual<Image, z.infer<typeof imageSchema>>>
>;

export type ImagesPostRequestTest = Expect<
  IsTrue<IsEqual<ImagesPostRequest, z.infer<typeof imagesPostRequestSchema>>>
>;
