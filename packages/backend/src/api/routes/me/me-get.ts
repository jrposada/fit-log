import type { MeResponse } from '@jrposada/fit-log-shared/models/auth/me';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiMe } from '../../mappers/me.ts';

const handler = toRequestHandler<MeResponse>(async (request) => {
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
