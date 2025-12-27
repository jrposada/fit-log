import z from 'zod';

import { Expect } from '../../types/expect';
import { IsEqual } from '../../types/is-equal';
import { IsTrue } from '../../types/is-true';
import { Session, sessionSchema } from './session';
import {
  SessionsDeleteParams,
  sessionsDeleteParamsSchema,
} from './session-delete';
import { SessionsGetQuery, sessionsGetQuerySchema } from './session-get';
import {
  SessionsGetByIdParams,
  sessionsGetByIdParamsSchema,
} from './session-get-by-id';
import { SessionsPutRequest, sessionsPutRequestSchema } from './session-put';

export type SessionTest = Expect<
  IsTrue<IsEqual<Session, z.infer<typeof sessionSchema>>>
>;

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
