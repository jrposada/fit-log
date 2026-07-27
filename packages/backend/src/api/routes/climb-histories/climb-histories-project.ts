import type {
  ClimbHistoryProjectRequest,
  ClimbHistoryProjectResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-project';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { setClimbHistoryProject } from '../../../services/climb-history.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimbHistory } from '../../mappers/climb-histories.ts';

const handler = toApiResponse<
  ClimbHistoryProjectResponse,
  unknown,
  unknown,
  ClimbHistoryProjectRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const climbHistory = await setClimbHistoryProject(
    request.user._id,
    request.body
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbHistory: climbHistory ? toApiClimbHistory(climbHistory) : null,
      },
    },
  };
});

export { handler };
