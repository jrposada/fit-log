import { CollaboratorDeleteParams } from '@shared/models/auth/collaborator-delete';
import { LocationsCollaboratorsResponse } from '@shared/models/location/location-collaborators';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { IImage } from '../../models/image';
import { Location } from '../../models/location';
import { ISector } from '../../models/sector';
import { removeCollaborator } from '../../utils/collaborator-mutators';
import { toApiResponse } from '../api-utils';
import { toApiLocation } from './locations-mapper';

const handler = toApiResponse<
  LocationsCollaboratorsResponse,
  CollaboratorDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;

  const location = await removeCollaborator(Location, id, userId, request.user)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{
      sectors: MergeType<ISector, { images: IImage[] }>[];
    }>({
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
