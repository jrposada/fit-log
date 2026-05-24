import {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import { LocationsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/location/location-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { MergeType } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { IImage } from '../../models/image.ts';
import { Location } from '../../models/location.ts';
import { ISector } from '../../models/sector.ts';
import { addOrUpdateCollaborator } from '../../utils/collaborator-mutators.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiLocation } from './locations-mapper.ts';

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
  )
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
