import {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@shared/models/auth/collaborator-put';
import { ClimbsCollaboratorsResponse } from '@shared/models/climb/climb-collaborators';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { Climb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { IModel3D } from '../../models/model3d';
import { ISector } from '../../models/sector';
import { addOrUpdateCollaborator } from '../../utils/collaborator-mutators';
import { toApiResponse } from '../api-utils';
import { toApiClimb } from './climbs-mapper';

const handler = toApiResponse<
  ClimbsCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const climb = await addOrUpdateCollaborator(
    Climb,
    id,
    userId,
    permission,
    request.user
  )
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{ model3d?: IModel3D; image: IImage; location: ILocation }>([
      'model3d',
      'image',
      'location',
    ])
    .populate<{
      sector: MergeType<ISector, { images: IImage[]; models3d: IModel3D[] }>;
    }>({
      path: 'sector',
      populate: ['images', 'models3d'],
    });

  if (!climb) {
    throw new ResourceNotFound(`Climb ${id} not found or not editable`);
  }

  return {
    statusCode: 200,
    body: { success: true, data: { climb: toApiClimb(climb) } },
  };
});

export { handler };
