import type {
  ClimbHistoriesDeleteParams,
  ClimbHistoriesDeleteQuery,
  ClimbHistoriesDeleteResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import {
  ClimbHistory,
  computeTopStatus,
} from '../../../models/climb-history.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { recomputeClimbingSessionSummary } from '../climbing-sessions/climbing-sessions-summary.ts';

const handler = toApiResponse<
  ClimbHistoriesDeleteResponse,
  ClimbHistoriesDeleteParams,
  ClimbHistoriesDeleteQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;
  const { tryId } = request.query;

  let affectedSessionId: string | null = null;

  if (tryId) {
    const climbHistory = await ClimbHistory.findOne({
      _id: id,
      owner: request.user._id,
    });
    assert(climbHistory, { msg: 'ClimbHistory not found' });

    affectedSessionId = climbHistory.climbingSession?.toString() ?? null;

    climbHistory.tries.pull({ _id: tryId });

    if (climbHistory.tries.length === 0) {
      await ClimbHistory.deleteOne({ _id: id, owner: request.user._id });
    } else {
      climbHistory.status = computeTopStatus(climbHistory.tries);
      await climbHistory.save();
    }
  } else {
    const climbHistory = await ClimbHistory.findOneAndDelete({
      _id: id,
      owner: request.user._id,
    });
    affectedSessionId = climbHistory?.climbingSession?.toString() ?? null;
  }

  if (affectedSessionId) {
    await recomputeClimbingSessionSummary(affectedSessionId);
  }

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
