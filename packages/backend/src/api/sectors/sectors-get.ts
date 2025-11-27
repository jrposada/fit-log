import {
  Sector,
  SectorsGetQuery,
  SectorsGetResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { SectorsService } from '../../services/sectors-service';
import { toApiResponse } from '../api-utils';
import { LocationsService } from '../../services/locations-service';

const handler = toApiResponse<SectorsGetResponse, unknown, SectorsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const params = request.query;

    const locationUuid = LocationsService.getLocationUuid(params.locationId);

    const { items: sectors, lastEvaluatedKey } =
      await SectorsService.instance.getSectorsByLocation(locationUuid);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          lastEvaluatedKey,
          sectors: sectors
            .map<Sector>((item) => ({
              id: item.SK,
              name: item.name,
              description: item.description,
              imageUrl: item.imageUrl,
              thumbnailUrl: item.thumbnailUrl,
              imageWidth: item.imageWidth,
              imageHeight: item.imageHeight,
              imageFileSize: item.imageFileSize,
              sortOrder: item.sortOrder,
              isPrimary: item.isPrimary,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            }))
            .sort((a, b) => a.sortOrder - b.sortOrder),
        },
      },
    };
  }
);

export { handler };
