import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import { Image, imageSchema } from './image';

export type ImageTest = Expect<
  IsTrue<IsEqual<Image, z.infer<typeof imageSchema>>>
>;
