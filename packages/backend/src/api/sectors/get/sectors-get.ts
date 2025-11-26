import {
  Sector,
  SectorsGetParams,
  sectorsGetParamsSchema,
  SectorsGetResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { SectorsService } from '../../../services/sectors-service';
import { apiHandler } from '../../api-utils';
import { LocationsService } from '../../../services/locations-service';

export const handler = apiHandler<SectorsGetResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { params } = validateEvent(event);

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

function validateEvent(event: APIGatewayProxyEvent): {
  params: SectorsGetParams;
} {
  try {
    const params = sectorsGetParamsSchema.parse(
      event.queryStringParameters ?? {}
    );
    return { params };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
