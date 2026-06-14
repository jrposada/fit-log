import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  ClimbingSessionsDeleteParams,
  climbingSessionsDeleteParamsSchema,
} from './climbing-sessions-delete.ts';
import {
  ClimbingSessionsGetQuery,
  climbingSessionsGetQuerySchema,
} from './climbing-sessions-get.ts';
import {
  ClimbingSessionsGetByIdParams,
  climbingSessionsGetByIdParamsSchema,
} from './climbing-sessions-get-by-id.ts';
import {
  ClimbingSessionsPutRequest,
  climbingSessionsPutRequestSchema,
} from './climbing-sessions-put.ts';

export type ClimbingSessionsGetQueryTest = Expect<
  IsTrue<
    IsEqual<
      ClimbingSessionsGetQuery,
      z.infer<typeof climbingSessionsGetQuerySchema>
    >
  >
>;

export type ClimbingSessionsPutRequestTest = Expect<
  IsTrue<
    IsEqual<
      ClimbingSessionsPutRequest,
      z.infer<typeof climbingSessionsPutRequestSchema>
    >
  >
>;

export type ClimbingSessionsDeleteParamsTest = Expect<
  IsTrue<
    IsEqual<
      ClimbingSessionsDeleteParams,
      z.infer<typeof climbingSessionsDeleteParamsSchema>
    >
  >
>;

export type ClimbingSessionsGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<
      ClimbingSessionsGetByIdParams,
      z.infer<typeof climbingSessionsGetByIdParamsSchema>
    >
  >
>;
