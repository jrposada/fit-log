import {
  BouldersPutRequest,
  bouldersPutRequestSchema,
  BouldersPutResponse,
} from '@shared/models/boulder';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { DbRecord } from '../../../services/aws/db-record';
import { BouldersService } from '../../../services/boulders-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<BouldersPutResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { boulderPutData } = validateEvent(event);
    const { userId } = authorizerContext;

    const record: DbRecord<'boulder'> = {
      image: boulderPutData.image,
      holds: boulderPutData.holds.map((hold) => ({
        x: hold.x,
        y: hold.y,
      })),
      name: boulderPutData.name,
      description: boulderPutData.description,
      createdAt: boulderPutData.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      PK: 'boulder',
      SK:
        (boulderPutData.id as DbRecord<'boulder'>['SK']) ??
        BouldersService.instance.newSk(userId),
    };

    void (await BouldersService.instance.put(record));

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          boulder: {
            id: record.SK,
            image: record.image,
            holds: record.holds,
            name: record.name,
            description: record.description,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          },
        },
      },
    };
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  boulderPutData: BouldersPutRequest;
} {
  if (!event.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = JSON.parse(event.body);
    const boulderPutData = bouldersPutRequestSchema.parse(body);
    return { boulderPutData };
  } catch {
    throw new Error('Invalid request');
  }
}
