import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Session,
  sessionSchema,
  SessionsDeleteParams,
  sessionsDeleteParamsSchema,
  SessionsGetByIdParams,
  sessionsGetByIdParamsSchema,
  SessionsGetQuery,
  sessionsGetQuerySchema,
  SessionsPutRequest,
  sessionsPutRequestSchema,
} from './session';

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
