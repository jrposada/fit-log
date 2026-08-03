import type { CollaboratorDeleteParams } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import type { Model3dsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/model-3d/model-3ds-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { removeModel3dCollaborator } from '../../../services/model-3d.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiModel3d } from '../../mappers/model-3ds.ts';

const handler = toRequestHandler<
  Model3dsCollaboratorsResponse,
  CollaboratorDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;

  const model3d = await removeModel3dCollaborator(request.user, id, userId);

  return {
    statusCode: 200,
    body: { success: true, data: { model3d: toApiModel3d(model3d) } },
  };
});

export { handler };
