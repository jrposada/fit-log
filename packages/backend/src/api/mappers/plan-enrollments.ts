import type { PlanEnrollment } from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollment';
import type { PlanEnrollmentsPutRequest } from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollments-put';

import type { IPlanEnrollment } from '../../data/models/plan-enrollment.ts';
import type { UpsertPlanEnrollmentInput } from '../../services/plan-enrollment.ts';

function toApiPlanEnrollment(model: IPlanEnrollment): PlanEnrollment {
  return {
    /* Data */
    id: model._id.toString(),
    planId: model.planId,
    startDate: model.startDate,
    status: model.status,

    /* Ownership */
    owner: model.owner.toString(),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toUpsertPlanEnrollmentInput(
  request: PlanEnrollmentsPutRequest
): UpsertPlanEnrollmentInput {
  return {
    /* Data */
    id: request.id,
    planId: request.planId,
    startDate: request.startDate,
    status: request.status ?? 'active',
  };
}

export { toApiPlanEnrollment, toUpsertPlanEnrollmentInput };
