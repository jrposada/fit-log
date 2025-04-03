import z from 'zod';
import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  Session,
  sessionSchema,
  SessionsPutRequest,
  sessionsPutRequestSchema,
} from './session';

export type SessionTest = Expect<
  IsTrue<IsEqual<Session, z.infer<typeof sessionSchema>>>
>;

export type SessionsPutRequestTest = Expect<
  IsTrue<IsEqual<SessionsPutRequest, z.infer<typeof sessionsPutRequestSchema>>>
>;
