import {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import { ImagesCollaboratorsResponse } from '@jrposada/fit-log-shared/models/image/image-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Image } from '../../models/image.ts';
import { addOrUpdateCollaborator } from '../../utils/collaborator-mutators.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiImage } from './images-mapper.ts';

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
