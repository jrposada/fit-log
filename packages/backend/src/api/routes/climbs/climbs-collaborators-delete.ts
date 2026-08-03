import type { CollaboratorDeleteParams } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import type { ClimbsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/climbs/climbs-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { removeClimbCollaborator } from '../../../services/climb.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiClimb } from '../../mappers/climbs.ts';

const handler = toRequestHandler<
  ClimbsCollaboratorsResponse,
  CollaboratorDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;

  const climb = await removeClimbCollaborator(request.user, id, userId);

  return {
    statusCode: 200,
    body: { success: true, data: { climb: toApiClimb(climb) } },
  };
});

export { handler };
