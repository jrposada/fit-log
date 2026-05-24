import { MeResponse } from '@shared/models/auth/me';
import { assert } from '@shared/utils/assert';

import { toApiResponse } from '../api-utils.ts';
import { toApiMe } from './me-mapper.ts';

const handler = toApiResponse<MeResponse>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  return {
    statusCode: 200,
    body: {
      success: true,
      data: toApiMe(request.user),
    },
  };
});

export { handler };
