import {
  ClimbHistoriesPutRequest,
  ClimbHistoriesPutResponse,
} from '@shared/models/climb-history/climb-history-put';
import { assert } from '@shared/utils/assert';
import { MergeType, Types } from 'mongoose';

import { IClimb } from '../../models/climb';
import {
  ClimbHistory,
  computeTopStatus,
  IClimbHistoryTry,
} from '../../models/climb-history';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiClimbHistory } from './climb-histories-mapper';
import { hasValidRefs } from './climb-histories-utils';

const handler = toApiResponse<
  ClimbHistoriesPutResponse,
  unknown,
  unknown,
  ClimbHistoriesPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { tryId, status, attempts, notes, date, climb, location, sector } =
    request.body;

  const newTry: Partial<IClimbHistoryTry> = {
    status,
    attempts,
    notes,
    date: date ? new Date(date) : new Date(),
  };

  let climbHistory;

  if (tryId) {
    climbHistory = await ClimbHistory.findOneAndUpdate(
      {
        climb: new Types.ObjectId(climb),
        'tries._id': new Types.ObjectId(tryId),
      },
      {
        $set: {
          'tries.$.status': newTry.status,
          'tries.$.attempts': newTry.attempts,
          'tries.$.notes': newTry.notes,
          'tries.$.date': newTry.date,
        },
      },
      { new: true }
    );

    assert(climbHistory, { msg: 'ClimbHistory or try not found' });

    climbHistory.status = computeTopStatus(climbHistory.tries);
    await climbHistory.save();
  } else {
    climbHistory = await ClimbHistory.findOneAndUpdate(
      { climb: new Types.ObjectId(climb) },
      {
        $push: { tries: newTry },
        $setOnInsert: {
          climb: new Types.ObjectId(climb),
          location: new Types.ObjectId(location),
          sector: new Types.ObjectId(sector),
        },
      },
      { new: true, upsert: true }
    );

    climbHistory.status = computeTopStatus(climbHistory.tries);
    await climbHistory.save();
  }

  const populated = await ClimbHistory.findById(climbHistory._id)
    .populate<{
      climb: IClimb;
      location: ILocation;
    }>(['climb', 'location'])
    .populate<{
      sector: MergeType<ISector, { images: IImage[] }>;
    }>({
      path: 'sector',
      populate: ['images'],
    });

  assert(populated, { msg: 'ClimbHistory not found after save' });
  if (!hasValidRefs(populated)) {
    throw new Error('ClimbHistory references deleted documents');
  }

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbHistory: toApiClimbHistory(populated),
      },
    },
  };
});

export { handler };
