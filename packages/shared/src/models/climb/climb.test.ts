import z from 'zod';

import { Expect } from '../../types/expect';
import { IsEqual } from '../../types/is-equal';
import { IsTrue } from '../../types/is-true';
import { ClimbsDeleteParams, climbsDeleteParamsSchema } from './climb-delete';
import { ClimbsGetQuery, climbsGetQuerySchema } from './climb-get';
import {
  ClimbsGetByIdParams,
  climbsGetByIdParamsSchema,
} from './climb-get-by-id';
import { ClimbsPutRequest, climbsPutRequestSchema } from './climb-put';
import { ClimbsSearchQuery, climbsSearchQuerySchema } from './climb-search';

export type ClimbsGetQueryTest = Expect<
  IsTrue<
    IsEqual<
      Omit<ClimbsGetQuery, 'grade'> & { grade?: string[] },
      z.infer<typeof climbsGetQuerySchema>
    >
  >
>;

export type ClimbsSearchQueryTest = Expect<
  IsTrue<
    IsEqual<
      Omit<ClimbsSearchQuery, 'grade'> & { grade?: string[] },
      z.infer<typeof climbsSearchQuerySchema>
    >
  >
>;

export type ClimbsPutRequestTest = Expect<
  IsTrue<
    IsEqual<
      Omit<ClimbsPutRequest, 'grade'> & { grade: string },
      z.infer<typeof climbsPutRequestSchema>
    >
  >
>;

export type ClimbsDeleteParamsTest = Expect<
  IsTrue<IsEqual<ClimbsDeleteParams, z.infer<typeof climbsDeleteParamsSchema>>>
>;

export type ClimbsGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<ClimbsGetByIdParams, z.infer<typeof climbsGetByIdParamsSchema>>
  >
>;
