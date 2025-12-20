import {
  LocationsGetByIdParams,
  LocationsGetByIdResponse,
} from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { Location } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiLocation } from './locations-mapper';

const handler = toApiResponse<LocationsGetByIdResponse, LocationsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const location = await Location.findById(id).populate<{
      sectors: MergeType<ISector, { climbs: IClimb[]; images: IImage[] }>[];
    }>({
      path: 'sectors',
      populate: [{ path: 'climbs' }, { path: 'images' }],
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
