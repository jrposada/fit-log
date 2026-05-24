import type { MeResponse } from '@jrposada/fit-log-shared/models/auth/me';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

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
