import type { TrainingPlansGetResponse } from '@jrposada/fit-log-shared/models/training-plans/training-plans-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getTrainingPlans } from '../../../services/training-plan.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiTrainingPlanSummary } from '../../mappers/training-plans.ts';

const handler = toRequestHandler<TrainingPlansGetResponse>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const trainingPlans = await getTrainingPlans();

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        trainingPlans: trainingPlans.map(toApiTrainingPlanSummary),
      },
    },
  };
});

export { handler };
