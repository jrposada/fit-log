import {
  ClimbHistoriesDeleteParams,
  ClimbHistoriesDeleteResponse,
} from '@shared/models/climb-history';
import { assert } from '@shared/utils/assert';

import { ClimbHistory } from '../../models/climb-history';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<
  ClimbHistoriesDeleteResponse,
  ClimbHistoriesDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  await ClimbHistory.deleteOne({ _id: id });

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
