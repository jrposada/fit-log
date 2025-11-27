import z from 'zod';

import { Expect } from '../types/expect';
import { IsEqual } from '../types/is-equal';
import { IsTrue } from '../types/is-true';
import {
  UsersAuthorizeRequest,
  usersAuthorizeRequestSchema,
  UsersPostRequest,
  usersPostRequestSchema,
} from './users';

export type UsersPostRequestTest = Expect<
  IsTrue<IsEqual<UsersPostRequest, z.infer<typeof usersPostRequestSchema>>>
>;

export type UsersAuthorizeRequestTest = Expect<
  IsTrue<
    IsEqual<UsersAuthorizeRequest, z.infer<typeof usersAuthorizeRequestSchema>>
  >
>;
