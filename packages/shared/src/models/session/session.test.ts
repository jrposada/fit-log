import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  SessionsDeleteParams,
  sessionsDeleteParamsSchema,
} from './session-delete.ts';
import { SessionsGetQuery, sessionsGetQuerySchema } from './session-get.ts';
import {
  SessionsGetByIdParams,
  sessionsGetByIdParamsSchema,
} from './session-get-by-id.ts';
import { SessionsPutRequest, sessionsPutRequestSchema } from './session-put.ts';

export type SessionsGetQueryTest = Expect<
  IsTrue<IsEqual<SessionsGetQuery, z.infer<typeof sessionsGetQuerySchema>>>
>;

export type SessionsPutRequestTest = Expect<
  IsTrue<IsEqual<SessionsPutRequest, z.infer<typeof sessionsPutRequestSchema>>>
>;

export type SessionsDeleteParamsTest = Expect<
  IsTrue<
    IsEqual<SessionsDeleteParams, z.infer<typeof sessionsDeleteParamsSchema>>
  >
>;

export type SessionsGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<SessionsGetByIdParams, z.infer<typeof sessionsGetByIdParamsSchema>>
  >
>;
