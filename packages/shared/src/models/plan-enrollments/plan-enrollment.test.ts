import z from 'zod';

import { Expect } from '../../types/expect.ts';
import { IsEqual } from '../../types/is-equal.ts';
import { IsTrue } from '../../types/is-true.ts';
import {
  PlanEnrollmentsPutRequest,
  planEnrollmentsPutRequestSchema,
} from './plan-enrollments-put.ts';

export type PlanEnrollmentsPutRequestTest = Expect<
  IsTrue<
    IsEqual<
      PlanEnrollmentsPutRequest,
      z.infer<typeof planEnrollmentsPutRequestSchema>
    >
  >
>;
