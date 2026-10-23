import { isMonday } from '@jrposada/fit-log-shared/common/training-plans/dates';
import type { Types } from 'mongoose';

import type { EntityAttributes } from '../data/infrastructure/entity-attributes.ts';
import type { IPlanEnrollment } from '../data/models/plan-enrollment.ts';
import { PlanEnrollment } from '../data/models/plan-enrollment.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import ValidationError from '../infrastructure/validation-error.ts';
import { getTrainingPlanById } from './training-plan.ts';

/** `owner` is set by the service from the authenticated user. */
type UpsertPlanEnrollmentInput = Omit<
  EntityAttributes<IPlanEnrollment>,
  'owner'
> & { id?: string };

async function getActivePlanEnrollment(
  owner: Types.ObjectId
): Promise<IPlanEnrollment | null> {
  return PlanEnrollment.findOne({ owner, status: 'active' });
}

async function upsertPlanEnrollment(
  owner: Types.ObjectId,
  input: UpsertPlanEnrollmentInput
): Promise<IPlanEnrollment> {
  const { id, ...data } = input;

  await getTrainingPlanById(data.planId);

  if (!isMonday(data.startDate)) {
    throw new ValidationError(
      `Plan enrollment start date ${data.startDate} is not a Monday`
    );
  }

  if (data.status === 'active') {
    // Checked up front so the caller gets a validation error; the partial
    // unique index only backstops concurrent writes.
    const otherActive = await PlanEnrollment.exists({
      owner,
      status: 'active',
      ...(id ? { _id: { $ne: id } } : {}),
    });
    if (otherActive) {
      throw new ValidationError('An active plan enrollment already exists');
    }
  }

  if (id) {
    const updated = await PlanEnrollment.findOneAndUpdate(
      { _id: id, owner },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new ResourceNotFound(
        `Plan enrollment ${id} not found or not editable`
      );
    }
    return updated;
  }

  return PlanEnrollment.create({ ...data, owner });
}

export { getActivePlanEnrollment, upsertPlanEnrollment };
export type { UpsertPlanEnrollmentInput };
