import type {
  ClimbsGetByIdParams,
  ClimbsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-get-by-id';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType } from 'mongoose';

import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { Climb } from '../../models/climb.ts';
import type { IImage } from '../../models/image.ts';
import type { ILocation } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiClimb } from './climbs-mapper.ts';

const handler = toApiResponse<ClimbsGetByIdResponse, ClimbsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const climb = await Climb.findById(id)
      .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
      .populate<{
        image: IImage;
        location: ILocation;
      }>(['image', 'location'])
      .populate<{
        sector: MergeType<ISector, { images: IImage[] }>;
      }>({
        path: 'sector',
        populate: ['images'],
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
