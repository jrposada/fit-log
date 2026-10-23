import z from 'zod';

import {
  PLAN_ENROLLMENT_STATUSES,
  PlanEnrollment,
  PlanEnrollmentStatus,
} from './plan-enrollment.ts';

export type PlanEnrollmentsPutRequest = Pick<
  PlanEnrollment,
  'planId' | 'startDate'
> & {
  id?: string;
  status?: PlanEnrollmentStatus;
};

export const planEnrollmentsPutRequestSchema = z.object({
  id: z.string().optional(),
  planId: z.string().nonempty(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(PLAN_ENROLLMENT_STATUSES).optional(),
});

export type PlanEnrollmentsPutResponse = {
  planEnrollment: PlanEnrollment;
};
