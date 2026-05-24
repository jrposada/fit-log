import { CollaboratorDeleteParams } from '@shared/models/auth/collaborator-delete';
import { ImagesCollaboratorsResponse } from '@shared/models/image/image-collaborators';
import { assert } from '@shared/utils/assert';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Image } from '../../models/image.ts';
import { removeCollaborator } from '../../utils/collaborator-mutators.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiImage } from './images-mapper.ts';

const handler = toApiResponse<
  ImagesCollaboratorsResponse,
  CollaboratorDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;

  const image = await removeCollaborator(
    Image,
    id,
    userId,
    request.user
  ).populate<PopulatedOwnership>([...OWNERSHIP_POPULATE]);

  if (!image) {
    throw new ResourceNotFound(`Image ${id} not found or not editable`);
  }

  return {
    statusCode: 200,
    body: { success: true, data: { image: toApiImage(image) } },
  };
});

export { handler };
