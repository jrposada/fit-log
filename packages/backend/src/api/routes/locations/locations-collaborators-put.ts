import type {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import type { LocationsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/locations/locations-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { addLocationCollaborator } from '../../../services/location.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiLocation } from '../../mappers/locations.ts';

const handler = toRequestHandler<
  LocationsCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const location = await addLocationCollaborator(
    request.user,
    id,
    userId,
    permission
  );

  return {
    statusCode: 200,
    body: { success: true, data: { location: toApiLocation(location) } },
  };
});

export { handler };
