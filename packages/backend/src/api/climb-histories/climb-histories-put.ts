import {
  ClimbHistoriesPutRequest,
  ClimbHistoriesPutResponse,
} from '@shared/models/climb-history/climb-history-put';
import { assert } from '@shared/utils/assert';
import { Types } from 'mongoose';

import { IClimb } from '../../models/climb';
import { ClimbHistory } from '../../models/climb-history';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { upsertDocument } from '../../utils/upsert-document';
import { toApiResponse } from '../api-utils';
import { toApiClimbHistory } from './climb-histories-mapper';

const handler = toApiResponse<
  ClimbHistoriesPutResponse,
  unknown,
  unknown,
  ClimbHistoriesPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const climbHistoryPutData = request.body;

  const climbHistory = await upsertDocument(
    ClimbHistory,
    climbHistoryPutData.id,
    {
      /* Data */
      status: climbHistoryPutData.status,
      attempts: climbHistoryPutData.attempts,
      notes: climbHistoryPutData.notes,

      /* References */
      climb: new Types.ObjectId(climbHistoryPutData.climb),
      location: new Types.ObjectId(climbHistoryPutData.location),
      sector: new Types.ObjectId(climbHistoryPutData.sector),
    }
  ).populate<{
    climb: IClimb;
    location: ILocation;
    sector: ISector;
  }>(['climb', 'location', 'sector']);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbHistory: toApiClimbHistory(climbHistory),
      },
    },
  };
});

export { handler };
