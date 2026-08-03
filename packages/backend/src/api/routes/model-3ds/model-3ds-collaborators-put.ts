import type {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import type { Model3dsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/model-3d/model-3ds-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { addModel3dCollaborator } from '../../../services/model-3d.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiModel3d } from '../../mappers/model-3ds.ts';

const handler = toRequestHandler<
  Model3dsCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const model3d = await addModel3dCollaborator(
    request.user,
    id,
    userId,
    permission
  );

  return {
    statusCode: 200,
    body: { success: true, data: { model3d: toApiModel3d(model3d) } },
  };
});

export { handler };
