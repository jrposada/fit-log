import type {
  TrainingPlansGetByIdParams,
  TrainingPlansGetByIdResponse,
} from '@jrposada/fit-log-shared/models/training-plans/training-plans-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getTrainingPlanById } from '../../../services/training-plan.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiTrainingPlan } from '../../mappers/training-plans.ts';

const handler = toRequestHandler<
  TrainingPlansGetByIdResponse,
  TrainingPlansGetByIdParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const trainingPlan = await getTrainingPlanById(id);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        trainingPlan: toApiTrainingPlan(trainingPlan),
      },
    },
  };
});

export { handler };
