import {
  ClimbHistoriesDeleteParams,
  ClimbHistoriesDeleteQuery,
  ClimbHistoriesDeleteResponse,
} from '@shared/models/climb-history/climb-history-delete';
import { assert } from '@shared/utils/assert';

import { ClimbHistory, computeTopStatus } from '../../models/climb-history';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<
  ClimbHistoriesDeleteResponse,
  ClimbHistoriesDeleteParams,
  ClimbHistoriesDeleteQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;
  const { tryId } = request.query;

  if (tryId) {
    const climbHistory = await ClimbHistory.findById(id);
    assert(climbHistory, { msg: 'ClimbHistory not found' });

    climbHistory.tries.pull({ _id: tryId });

    if (climbHistory.tries.length === 0) {
      await ClimbHistory.deleteOne({ _id: id });
    } else {
      climbHistory.status = computeTopStatus(climbHistory.tries);
      await climbHistory.save();
    }
  } else {
    await ClimbHistory.deleteOne({ _id: id });
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
