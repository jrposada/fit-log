import type { CollaboratorDeleteParams } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import type { LocationsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/location/location-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType } from 'mongoose';

import type {
  PopulatedOwnership} from '../../auth/ownership-populate.ts';
import {
  OWNERSHIP_POPULATE
} from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import type { IImage } from '../../models/image.ts';
import { Location } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
import { removeCollaborator } from '../../utils/collaborator-mutators.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiLocation } from './locations-mapper.ts';

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
