import { CollaboratorDeleteParams } from '@shared/models/auth/collaborator-delete';
import { ImagesCollaboratorsResponse } from '@shared/models/image/image-collaborators';
import { assert } from '@shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { Image } from '../../models/image';
import { removeCollaborator } from '../../utils/collaborator-mutators';
import { toApiResponse } from '../api-utils';
import { toApiImage } from './images-mapper';

const handler = toApiResponse<
  ImagesCollaboratorsResponse,
  CollaboratorDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;

  const image = await removeCollaborator(Image, id, userId, request.user);

  if (!image) {
    throw new ResourceNotFound(`Image ${id} not found or not editable`);
  }

  return {
    statusCode: 200,
    body: { success: true, data: { image: toApiImage(image) } },
  };
});

export { handler };
