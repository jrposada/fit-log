import type { PlanEnrollmentStatus } from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollment';
import { PLAN_ENROLLMENT_STATUSES } from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollment';
import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

export type { PlanEnrollmentStatus };

export interface IPlanEnrollment extends WithTimestamps<
  Document<Types.ObjectId>
> {
  /* Data */
  /** Catalog id of the `TrainingPlan`, not an ObjectId. */
  planId: string;
  /** `YYYY-MM-DD` calendar date, kept as a string so the plan's day math
   * never depends on a timezone. */
  startDate: string;
  status: PlanEnrollmentStatus;

  /* Ownership */
  owner: Types.ObjectId;
}

const planEnrollmentSchema = new Schema<IPlanEnrollment>(
  {
    /* Data */
    planId: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: PLAN_ENROLLMENT_STATUSES,
      required: true,
      default: 'active',
    },

    /* Ownership */
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// At most one active enrollment per user.
planEnrollmentSchema.index(
  { owner: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);

export const PlanEnrollment = model<IPlanEnrollment>(
  'PlanEnrollment',
  planEnrollmentSchema
);
