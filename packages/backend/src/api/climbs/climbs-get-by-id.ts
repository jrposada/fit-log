import {
  ClimbsGetByIdParams,
  ClimbsGetByIdResponse,
} from '@shared/models/climb/climb-get-by-id';
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
import { toApiResponse } from '../api-utils';
import { toApiClimb } from './climbs-mapper';

const handler = toApiResponse<ClimbsGetByIdResponse, ClimbsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const climb = await Climb.findById(id)
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
      throw new ResourceNotFound(`Climb with id ${id} not found`);
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climb: toApiClimb(climb),
        },
      },
    };
  }
);

export { handler };
