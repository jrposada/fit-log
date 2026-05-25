import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  ClimbsDeleteParams,
  climbsDeleteParamsSchema,
} from './climbs-delete.ts';
import { ClimbsGetQuery, climbsGetQuerySchema } from './climbs-get.ts';
import {
  ClimbsGetByIdParams,
  climbsGetByIdParamsSchema,
} from './climbs-get-by-id.ts';
import { ClimbsPutRequest, climbsPutRequestSchema } from './climbs-put.ts';
import { ClimbsSearchQuery, climbsSearchQuerySchema } from './climbs-search.ts';

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
