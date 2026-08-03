import type {
  ClimbHistoriesDeleteParams,
  ClimbHistoriesDeleteQuery,
  ClimbHistoriesDeleteResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteClimbHistory } from '../../../services/climb-history.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<
  ClimbHistoriesDeleteResponse,
  ClimbHistoriesDeleteParams,
  ClimbHistoriesDeleteQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;
  const { tryId } = request.query;

  await deleteClimbHistory(request.user._id, id, tryId);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
