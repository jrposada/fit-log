import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  TrainingSessionsDeleteParams,
  trainingSessionsDeleteParamsSchema,
} from './training-session-delete.ts';
import {
  TrainingSessionsGetQuery,
  trainingSessionsGetQuerySchema,
} from './training-session-get.ts';
import {
  TrainingSessionsGetByIdParams,
  trainingSessionsGetByIdParamsSchema,
} from './training-session-get-by-id.ts';
import {
  TrainingSessionsPutRequest,
  trainingSessionsPutRequestSchema,
} from './training-session-put.ts';

export type TrainingSessionsGetQueryTest = Expect<
  IsTrue<
    IsEqual<
      TrainingSessionsGetQuery,
      z.infer<typeof trainingSessionsGetQuerySchema>
    >
  >
>;

export type TrainingSessionsPutRequestTest = Expect<
  IsTrue<
    IsEqual<
      TrainingSessionsPutRequest,
      z.infer<typeof trainingSessionsPutRequestSchema>
    >
  >
>;

export type TrainingSessionsDeleteParamsTest = Expect<
  IsTrue<
    IsEqual<
      TrainingSessionsDeleteParams,
      z.infer<typeof trainingSessionsDeleteParamsSchema>
    >
  >
>;

export type TrainingSessionsGetByIdParamsTest = Expect<
  IsTrue<
    IsEqual<
      TrainingSessionsGetByIdParams,
      z.infer<typeof trainingSessionsGetByIdParamsSchema>
    >
  >
>;
