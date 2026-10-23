import type {
  PlanEnrollmentsPutRequest,
  PlanEnrollmentsPutResponse,
} from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollments-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertPlanEnrollment } from '../../../services/plan-enrollment.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import {
  toApiPlanEnrollment,
  toUpsertPlanEnrollmentInput,
} from '../../mappers/plan-enrollments.ts';

const handler = toRequestHandler<
  PlanEnrollmentsPutResponse,
  unknown,
  unknown,
  PlanEnrollmentsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const planEnrollment = await upsertPlanEnrollment(
    request.user._id,
    toUpsertPlanEnrollmentInput(request.body)
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        planEnrollment: toApiPlanEnrollment(planEnrollment),
      },
    },
  };
});

export { handler };
