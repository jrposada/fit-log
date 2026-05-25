import type {
  TrainingSessionsGetByIdParams,
  TrainingSessionsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import type { IClimbHistory } from '../../models/climb-history.ts';
import type { ILocation } from '../../models/location.ts';
import { TrainingSession } from '../../models/training-session.ts';
import { toApiResponse } from '../api-utils.ts';
import { hasRequiredClimbHistoryRefs } from '../climb-histories/climb-histories-utils.ts';
import { toApiTrainingSession } from './training-sessions-mapper.ts';

const handler = toApiResponse<
  TrainingSessionsGetByIdResponse,
  TrainingSessionsGetByIdParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const session = await TrainingSession.findById(id)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{ location: ILocation | null; climbHistories: IClimbHistory[] }>([
      'location',
      'climbHistories',
    ]);
  if (!session) {
    throw new ResourceNotFound(`Training session with id ${id} not found`);
  }

  const sessionWithValidClimbHistories = Object.assign(session, {
    climbHistories: session.climbHistories.filter(hasRequiredClimbHistoryRefs),
  });

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        trainingSession: toApiTrainingSession(sessionWithValidClimbHistories),
      },
    },
  };
});

export { handler };
