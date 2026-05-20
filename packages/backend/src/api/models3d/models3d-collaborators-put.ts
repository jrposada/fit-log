import {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@shared/models/auth/collaborator-put';
import { Models3dCollaboratorsResponse } from '@shared/models/model3d/model3d-collaborators';
import { assert } from '@shared/utils/assert';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { Model3D } from '../../models/model3d';
import { addOrUpdateCollaborator } from '../../utils/collaborator-mutators';
import { toApiResponse } from '../api-utils';
import { toApiModel3D } from './models3d-mapper';

const handler = toApiResponse<
  Models3dCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const model3d = await addOrUpdateCollaborator(
    Model3D,
    id,
    userId,
    permission,
    request.user
  ).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!model3d) {
    throw new ResourceNotFound(`Model3D ${id} not found or not editable`);
  }

  return {
    statusCode: 200,
    body: { success: true, data: { model3d: toApiModel3D(model3d) } },
  };
});

export { handler };
