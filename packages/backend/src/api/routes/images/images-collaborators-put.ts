import type {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import type { ImagesCollaboratorsResponse } from '@jrposada/fit-log-shared/models/images/images-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { addImageCollaborator } from '../../../services/image.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiImage } from '../../mappers/images.ts';

const handler = toRequestHandler<
  ImagesCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const image = await addImageCollaborator(
    request.user,
    id,
    userId,
    permission
  );

  return {
    statusCode: 200,
    body: { success: true, data: { image: toApiImage(image) } },
  };
});

export { handler };
