import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import { FeedGetQuery, feedGetQuerySchema } from './feed-get.ts';

export type FeedGetQueryTest = Expect<
  IsTrue<IsEqual<FeedGetQuery, z.infer<typeof feedGetQuerySchema>>>
>;
