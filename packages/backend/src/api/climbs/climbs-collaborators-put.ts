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
} from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Climb } from '../../models/climb.ts';
import { IImage } from '../../models/image.ts';
import { ILocation } from '../../models/location.ts';
import { ISector } from '../../models/sector.ts';
import { addOrUpdateCollaborator } from '../../utils/collaborator-mutators.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiClimb } from './climbs-mapper.ts';

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
    .populate<{ image: IImage; location: ILocation }>(['image', 'location'])
    .populate<{ sector: MergeType<ISector, { images: IImage[] }> }>({
      path: 'sector',
      populate: ['images'],
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
