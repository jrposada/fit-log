import { ClimbsPutRequest, ClimbsPutResponse } from '@shared/models/climb';
import { assert } from '@shared/utils/assert';

import { DbRecord } from '../../services/aws/db-record';
import { ClimbsService } from '../../services/climbs-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<
  ClimbsPutResponse,
  unknown,
  unknown,
  ClimbsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const climbPutData = request.body;

  const record: DbRecord<'climb'> = {
    location: climbPutData.location as DbRecord<'climb'>['location'],
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
      ClimbsService.instance.newSk(),
  };

  void (await ClimbsService.instance.put(record));

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climb: {
          id: record.SK,
          location: record.location,
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
});

export { handler };
