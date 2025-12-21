import {
  ClimbHistoriesGetByIdParams,
  ClimbHistoriesGetByIdResponse,
} from '@shared/models/climb-history';
import { assert } from '@shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { ClimbHistory } from '../../models/climb-history';
import { toApiResponse } from '../api-utils';
import { toApiClimbHistory } from './climb-histories-mapper';

const handler = toApiResponse<
  ClimbHistoriesGetByIdResponse,
  ClimbHistoriesGetByIdParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  const climbHistory = await ClimbHistory.findById(id);

  if (!climbHistory) {
    throw new ResourceNotFound(`ClimbHistory with id ${id} not found`);
  }

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbHistory: toApiClimbHistory(climbHistory),
      },
    },
  };
});

export { handler };
