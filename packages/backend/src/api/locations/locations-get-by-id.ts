import type {
  LocationsGetByIdParams,
  LocationsGetByIdResponse,
} from '@jrposada/fit-log-shared/models/location/location-get-by-id';
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
import { toApiResponse } from '../api-utils.ts';
import { toApiLocation } from './locations-mapper.ts';

const handler = toApiResponse<LocationsGetByIdResponse, LocationsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const location = await Location.findById(id)

      .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
      .populate<{
        sectors: MergeType<ISector, { images: IImage[] }>[];
      }>({
        path: 'sectors',
        populate: ['images'],
      });

    if (!location) {
      throw new ResourceNotFound(`Location with id ${id} not found`);
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          location: toApiLocation(location),
        },
      },
    };
  }
);

export { handler };
