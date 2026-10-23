import { WithTimestamps } from '../utils/with-timestamps.ts';

export const PLAN_ENROLLMENT_STATUSES = [
  'active',
  'completed',
  'abandoned',
] as const;
export type PlanEnrollmentStatus = (typeof PLAN_ENROLLMENT_STATUSES)[number];

export type PlanEnrollment = WithTimestamps<{
  /* Data */
  id: string;
  planId: string;
  /** `YYYY-MM-DD` calendar date, always a Monday. */
  startDate: string;
  status: PlanEnrollmentStatus;

  /* Ownership */
  owner: string;
}>;
