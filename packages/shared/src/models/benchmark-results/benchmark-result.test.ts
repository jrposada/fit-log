import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  BenchmarkResultsDeleteParams,
  benchmarkResultsDeleteParamsSchema,
} from './benchmark-results-delete.ts';
import {
  BenchmarkResultsGetQuery,
  benchmarkResultsGetQuerySchema,
} from './benchmark-results-get.ts';
import {
  BenchmarkResultsPutRequest,
  benchmarkResultsPutRequestSchema,
} from './benchmark-results-put.ts';

export type BenchmarkResultsGetQueryTest = Expect<
  IsTrue<
    IsEqual<
      BenchmarkResultsGetQuery,
      z.infer<typeof benchmarkResultsGetQuerySchema>
    >
  >
>;

export type BenchmarkResultsPutRequestTest = Expect<
  IsTrue<
    IsEqual<
      BenchmarkResultsPutRequest,
      z.infer<typeof benchmarkResultsPutRequestSchema>
    >
  >
>;

export type BenchmarkResultsDeleteParamsTest = Expect<
  IsTrue<
    IsEqual<
      BenchmarkResultsDeleteParams,
      z.infer<typeof benchmarkResultsDeleteParamsSchema>
    >
  >
>;
