import {
  LocationsGetQuery,
  LocationsGetResponse,
} from '@shared/models/location/location-get';
import { assert } from '@shared/utils/assert';
import { MergeType } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate';
import { IImage } from '../../models/image';
import { Location } from '../../models/location';
import { IModel3D } from '../../models/model3d';
import { ISector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiLocation } from './locations-mapper';

const handler = toApiResponse<LocationsGetResponse, unknown, LocationsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { limit } = request.query;

    const query = Location.find()
      .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
      .populate<{
        sectors: MergeType<
          ISector,
          { images: IImage[]; models3d: IModel3D[] }
        >[];
      }>({
        path: 'sectors',
        populate: ['images', 'models3d'],
      });

    if (limit) {
      query.limit(limit);
    }

    const locations = await query.exec();

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          locations: locations.map(toApiLocation),
        },
      },
    };
  }
);

export { handler };
