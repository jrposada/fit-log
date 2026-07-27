import type {
  ClimbingSessionsGetQuery,
  ClimbingSessionsGetResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import type { IClimbHistory } from '../../../models/climb-history.ts';
import { ClimbingSession } from '../../../models/climbing-session.ts';
import type { ILocation } from '../../../models/location.ts';
import { hasRequiredClimbHistoryRefs } from '../../../services/climb-history.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimbingSession } from '../../mappers/climbing-sessions.ts';

const handler = toApiResponse<
  ClimbingSessionsGetResponse,
  unknown,
  ClimbingSessionsGetQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { limit, active } = request.query;

  const filter: Record<string, unknown> = { owner: request.user._id };
  if (active) {
    filter.endedAt = { $exists: false };
  }

  const query = ClimbingSession.find(filter).sort({
    startedAt: -1,
  });

  if (limit) {
    query.limit(limit);
  }

  const sessions = await query.populate<{
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
        climbingSessions:
          sessionsWithValidClimbHistories.map(toApiClimbingSession),
      },
    },
  };
});

export { handler };
