import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  ClimbHistoriesDeleteParams,
  climbHistoriesDeleteParamsSchema,
  ClimbHistoriesDeleteQuery,
  climbHistoriesDeleteQuerySchema,
} from './climb-histories-delete.ts';
import {
  ClimbHistoriesGetQuery,
  climbHistoriesGetQuerySchema,
} from './climb-histories-get.ts';
import {
  ClimbHistoriesGetByIdParams,
  climbHistoriesGetByIdParamsSchema,
} from './climb-histories-get-by-id.ts';
import {
  ClimbHistoriesPutRequest,
  climbHistoriesPutRequestSchema,
} from './climb-histories-put.ts';
import {
  ClimbHistoriesStatsQuery,
  climbHistoriesStatsQuerySchema,
} from './climb-histories-stats.ts';

export type ClimbHistoriesGetQueryTest = Expect<
  IsTrue<
    IsEqual<
      ClimbHistoriesGetQuery,
      z.infer<typeof climbHistoriesGetQuerySchema>
    >
  >
>;

export type ClimbHistoriesPutRequestTest = Expect<
  IsTrue<
    IsEqual<
      ClimbHistoriesPutRequest,
      z.infer<typeof climbHistoriesPutRequestSchema>
    >
  >
>;

export type ClimbHistoriesDeleteParamsTest = Expect<
  IsTrue<
    IsEqual<
      ClimbHistoriesDeleteParams,
      z.infer<typeof climbHistoriesDeleteParamsSchema>
    >
  >
>;

export type ClimbHistoriesDeleteQueryTest = Expect<
  IsTrue<
    IsEqual<
      ClimbHistoriesDeleteQuery,
      z.infer<typeof climbHistoriesDeleteQuerySchema>
    >
  >
>;

export type ClimbHistoriesGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<
      ClimbHistoriesGetByIdParams,
      z.infer<typeof climbHistoriesGetByIdParamsSchema>
    >
  >
>;

export type ClimbHistoriesStatsQueryTest = Expect<
  IsTrue<
    IsEqual<
      ClimbHistoriesStatsQuery,
      z.infer<typeof climbHistoriesStatsQuerySchema>
    >
  >
>;
