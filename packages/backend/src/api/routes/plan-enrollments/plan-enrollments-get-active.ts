import type { PlanEnrollmentsGetActiveResponse } from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollments-get-active';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getActivePlanEnrollment } from '../../../services/plan-enrollment.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiPlanEnrollment } from '../../mappers/plan-enrollments.ts';

const handler = toRequestHandler<PlanEnrollmentsGetActiveResponse>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const planEnrollment = await getActivePlanEnrollment(request.user._id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          planEnrollment: planEnrollment
            ? toApiPlanEnrollment(planEnrollment)
            : null,
        },
      },
    };
  }
);

export { handler };
