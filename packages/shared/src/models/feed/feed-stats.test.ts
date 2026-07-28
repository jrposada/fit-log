import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import { FeedStatsQuery, feedStatsQuerySchema } from './feed-stats.ts';

export type FeedStatsQueryTest = Expect<
  IsTrue<IsEqual<FeedStatsQuery, z.infer<typeof feedStatsQuerySchema>>>
>;
