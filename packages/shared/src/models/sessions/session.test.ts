import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  SessionsDeleteParams,
  sessionsDeleteParamsSchema,
} from './sessions-delete.ts';
import { SessionsGetQuery, sessionsGetQuerySchema } from './sessions-get.ts';
import {
  SessionsGetByIdParams,
  sessionsGetByIdParamsSchema,
} from './sessions-get-by-id.ts';
import {
  SessionsPutRequest,
  sessionsPutRequestSchema,
} from './sessions-put.ts';

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
