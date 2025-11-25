import {
  SectorsDeleteParams,
  sectorsDeleteParamsSchema,
  SectorsDeleteResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { SectorsService } from '../../../services/sectors-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<SectorsDeleteResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { params } = validateEvent(event);

    void (await SectorsService.instance.delete(params.id));

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          success: true,
        },
      },
    };
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  params: SectorsDeleteParams;
} {
  try {
    const params = sectorsDeleteParamsSchema.parse(event.pathParameters ?? {});
    return { params };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
