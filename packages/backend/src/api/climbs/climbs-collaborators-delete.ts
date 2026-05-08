import { CollaboratorDeleteParams } from '@shared/models/auth/collaborator-delete';
import { ClimbsCollaboratorsResponse } from '@shared/models/climb/climb-collaborators';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { Climb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { removeCollaborator } from '../../utils/collaborator-mutators';
import { toApiResponse } from '../api-utils';
import { toApiClimb } from './climbs-mapper';

const handler = toApiResponse<ClimbsCollaboratorsResponse, CollaboratorDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id, userId } = request.params;

    const climb = await removeCollaborator(Climb, id, userId, request.user)
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
  }
);

export { handler };
