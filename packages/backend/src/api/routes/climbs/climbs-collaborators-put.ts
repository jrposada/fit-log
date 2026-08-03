import type {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import type { ClimbsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/climbs/climbs-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { addClimbCollaborator } from '../../../services/climb.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiClimb } from '../../mappers/climbs.ts';

const handler = toRequestHandler<
  ClimbsCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const climb = await addClimbCollaborator(
    request.user,
    id,
    userId,
    permission
  );

  return {
    statusCode: 200,
    body: { success: true, data: { climb: toApiClimb(climb) } },
  };
});

export { handler };
