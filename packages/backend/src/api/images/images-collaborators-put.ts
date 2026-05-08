import {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@shared/models/auth/collaborator-put';
import { ImagesCollaboratorsResponse } from '@shared/models/image/image-collaborators';
import { assert } from '@shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { Image } from '../../models/image';
import { addOrUpdateCollaborator } from '../../utils/collaborator-mutators';
import { toApiResponse } from '../api-utils';
import { toApiImage } from './images-mapper';

const handler = toApiResponse<
  ImagesCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const image = await addOrUpdateCollaborator(
    Image,
    id,
    userId,
    permission,
    request.user
  );

  if (!image) {
    throw new ResourceNotFound(`Image ${id} not found or not editable`);
  }

  return {
    statusCode: 200,
    body: { success: true, data: { image: toApiImage(image) } },
  };
});

export { handler };
