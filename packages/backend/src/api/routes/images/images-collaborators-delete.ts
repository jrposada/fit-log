import type { CollaboratorDeleteParams } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import type { ImagesCollaboratorsResponse } from '@jrposada/fit-log-shared/models/images/images-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { removeImageCollaborator } from '../../../services/image.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiImage } from '../../mappers/images.ts';

const handler = toRequestHandler<
  ImagesCollaboratorsResponse,
  CollaboratorDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;

  const image = await removeImageCollaborator(request.user, id, userId);

  return {
    statusCode: 200,
    body: { success: true, data: { image: toApiImage(image) } },
  };
});

export { handler };
