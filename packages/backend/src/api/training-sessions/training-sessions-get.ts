import type {
  TrainingSessionsGetQuery,
  TrainingSessionsGetResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import type { IClimbHistory } from '../../models/climb-history.ts';
import type { ILocation } from '../../models/location.ts';
import { TrainingSession } from '../../models/training-session.ts';
import { toApiResponse } from '../api-utils.ts';
import { hasRequiredClimbHistoryRefs } from '../climb-histories/climb-histories-utils.ts';
import { toApiTrainingSession } from './training-sessions-mapper.ts';

const handler = toApiResponse<
  TrainingSessionsGetResponse,
  unknown,
  TrainingSessionsGetQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { limit } = request.query;

  const query = TrainingSession.find({ owner: request.user._id }).sort({
    startedAt: -1,
  });

  if (limit) {
    query.limit(limit);
  }

  const sessions = await query
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      location: ILocation | null;
      climbHistories: IClimbHistory[];
    }>(['location', 'climbHistories']);

  const sessionsWithValidClimbHistories = sessions.map((session) =>
    Object.assign(session, {
      climbHistories: session.climbHistories.filter(
        hasRequiredClimbHistoryRefs
      ),
    })
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        trainingSessions:
          sessionsWithValidClimbHistories.map(toApiTrainingSession),
      },
    },
  };
});

export { handler };
