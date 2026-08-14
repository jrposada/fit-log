import type {
  ClimbsPutRequest,
  ClimbsPutResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertClimb } from '../../../services/climb.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiClimb, toUpsertClimbInput } from '../../mappers/climbs.ts';

const handler = toRequestHandler<
  ClimbsPutResponse,
  unknown,
  unknown,
  ClimbsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const climb = await upsertClimb(
    request.user,
    toUpsertClimbInput(request.body)
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climb: toApiClimb(climb),
      },
    },
  };
});

export { handler };
