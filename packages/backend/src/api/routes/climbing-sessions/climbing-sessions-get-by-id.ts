import type {
  ClimbingSessionsGetByIdParams,
  ClimbingSessionsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import ResourceNotFound from '../../../infrastructure/not-found-error.ts';
import type { IClimbHistory } from '../../../models/climb-history.ts';
import { ClimbingSession } from '../../../models/climbing-session.ts';
import type { ILocation } from '../../../models/location.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { hasRequiredClimbHistoryRefs } from '../climb-histories/climb-histories-utils.ts';
import { toApiClimbingSession } from './climbing-sessions-mapper.ts';

const handler = toApiResponse<
  ClimbingSessionsGetByIdResponse,
  ClimbingSessionsGetByIdParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const session = await ClimbingSession.findOne({
    _id: id,
    owner: request.user._id,
  }).populate<{ location: ILocation | null; climbHistories: IClimbHistory[] }>([
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
        climbingSession: toApiClimbingSession(sessionWithValidClimbHistories),
      },
    },
  };
});

export { handler };
