import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  ClimbHistory,
  climbHistorySchema,
  ClimbHistoriesDeleteParams,
  climbHistoriesDeleteParamsSchema,
  ClimbHistoriesGetByIdParams,
  climbHistoriesGetByIdParamsSchema,
  ClimbHistoriesGetQuery,
  climbHistoriesGetQuerySchema,
  ClimbHistoriesPutRequest,
  climbHistoriesPutRequestSchema,
} from './climb-history';

export type ClimbHistoryTest = Expect<
  IsTrue<IsEqual<ClimbHistory, z.infer<typeof climbHistorySchema>>>
>;

export type ClimbHistoriesGetQueryTest = Expect<
  IsTrue<
    IsEqual<ClimbHistoriesGetQuery, z.infer<typeof climbHistoriesGetQuerySchema>>
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

export type ClimbHistoriesGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<
      ClimbHistoriesGetByIdParams,
      z.infer<typeof climbHistoriesGetByIdParamsSchema>
    >
  >
>;
