import {
  ClimbsPutRequest,
  climbsPutRequestSchema,
  ClimbsPutResponse,
} from '@shared/models/climb';
import { assert } from '@shared/utils/assert';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { DbRecord } from '../../../services/aws/db-record';
import { ClimbsService } from '../../../services/climbs-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<ClimbsPutResponse>(
  async ({ authorizerContext, event }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { climbPutData } = validateEvent(event);
    const { userId } = authorizerContext;

    const record: DbRecord<'climb'> = {
      holds: climbPutData.holds.map((hold) => ({
        x: hold.x,
        y: hold.y,
      })),
      name: climbPutData.name,
      grade: climbPutData.grade,
      description: climbPutData.description,
      sector: climbPutData.sector,
      createdAt: climbPutData.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      PK: 'climb',
      SK:
        (climbPutData.id as DbRecord<'climb'>['SK']) ??
        ClimbsService.instance.newSk(userId),
    };

    void (await ClimbsService.instance.put(record));

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climb: {
            id: record.SK,
            holds: record.holds,
            name: record.name,
            grade: record.grade,
            description: record.description,
            sector: record.sector,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          },
        },
      },
    };
  }
);

function validateEvent(event: APIGatewayProxyEvent): {
  climbPutData: ClimbsPutRequest;
} {
  if (!event.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = JSON.parse(event.body);
    const climbPutData = climbsPutRequestSchema.parse(body);
    return { climbPutData };
  } catch {
    throw new Error('Invalid request');
  }
}
