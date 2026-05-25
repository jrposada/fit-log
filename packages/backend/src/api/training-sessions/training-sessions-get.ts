import type {
  TrainingSessionsGetQuery,
  TrainingSessionsGetResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import type { IClimb } from '../../models/climb.ts';
import type { ILocation } from '../../models/location.ts';
import { TrainingSession } from '../../models/training-session.ts';
import { hasRequiredRefs } from '../../services/climb.ts';
import type { WithRequiredRefs } from '../../utils/types.ts';
import { toApiResponse } from '../api-utils.ts';
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
      climbs: IClimb[];
    }>(['location', 'climbs']);

  const sessionsWithValidClimbs = sessions.map(
    (session) =>
      Object.assign(session, {
        climbs: session.climbs.filter(hasRequiredRefs),
      }) as Omit<typeof session, 'climbs'> & {
        climbs: WithRequiredRefs<IClimb>[];
      }
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        trainingSessions: sessionsWithValidClimbs.map(toApiTrainingSession),
      },
    },
  };
});

export { handler };
