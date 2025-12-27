import z from 'zod';

import { Expect } from '../../types/expect';
import { IsEqual } from '../../types/is-equal';
import { IsTrue } from '../../types/is-true';
import { ClimbHistory, climbHistorySchema } from './climb-history';
import {
  ClimbHistoriesDeleteParams,
  climbHistoriesDeleteParamsSchema,
} from './climb-history-delete';
import {
  ClimbHistoriesGetQuery,
  climbHistoriesGetQuerySchema,
} from './climb-history-get';
import {
  ClimbHistoriesGetByIdParams,
  climbHistoriesGetByIdParamsSchema,
} from './climb-history-get-by-id';
import {
  ClimbHistoriesPutRequest,
  climbHistoriesPutRequestSchema,
} from './climb-history-put';

export type ClimbHistoryTest = Expect<
  IsTrue<IsEqual<ClimbHistory, z.infer<typeof climbHistorySchema>>>
>;

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

export type ClimbHistoriesGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<
      ClimbHistoriesGetByIdParams,
      z.infer<typeof climbHistoriesGetByIdParamsSchema>
    >
  >
>;
