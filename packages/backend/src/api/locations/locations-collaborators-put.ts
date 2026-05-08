import {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@shared/models/auth/collaborator-put';
import { LocationsCollaboratorsResponse } from '@shared/models/location/location-collaborators';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { IImage } from '../../models/image';
import { Location } from '../../models/location';
import { ISector } from '../../models/sector';
import { addOrUpdateCollaborator } from '../../utils/collaborator-mutators';
import { toApiResponse } from '../api-utils';
import { toApiLocation } from './locations-mapper';

const handler = toApiResponse<
  LocationsCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const location = await addOrUpdateCollaborator(
    Location,
    id,
    userId,
    permission,
    request.user
  ).populate<{ sectors: MergeType<ISector, { images: IImage[] }>[] }>({
    path: 'sectors',
    populate: ['images'],
  });

  if (!location) {
    throw new ResourceNotFound(`Location ${id} not found or not editable`);
  }

  return {
    statusCode: 200,
    body: { success: true, data: { location: toApiLocation(location) } },
  };
});

export { handler };
