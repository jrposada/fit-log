import type { CollaboratorDeleteParams } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import type { LocationsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/locations/locations-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { removeLocationCollaborator } from '../../../services/location.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiLocation } from '../../mappers/locations.ts';

const handler = toRequestHandler<
  LocationsCollaboratorsResponse,
  CollaboratorDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;

  const location = await removeLocationCollaborator(request.user, id, userId);

  return {
    statusCode: 200,
    body: { success: true, data: { location: toApiLocation(location) } },
  };
});

export { handler };
