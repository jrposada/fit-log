import {
  ClimbHistoryProjectRequest,
  ClimbHistoryProjectResponse,
} from '@shared/models/climb-history/climb-history-project';
import { assert } from '@shared/utils/assert';
import { MergeType, Types } from 'mongoose';

import { IClimb } from '../../models/climb';
import { ClimbHistory } from '../../models/climb-history';
import { IImage } from '../../models/image';
import { ILocation } from '../../models/location';
import { ISector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiClimbHistory } from './climb-histories-mapper';
import { hasValidRefs } from './climb-histories-utils';

const handler = toApiResponse<
  ClimbHistoryProjectResponse,
  unknown,
  unknown,
  ClimbHistoryProjectRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { isProject, climb, location, sector } = request.body;

  // Unproject with no tries → delete the ClimbHistory
  if (!isProject) {
    const existing = await ClimbHistory.findOne({
      climb: new Types.ObjectId(climb),
      tries: { $size: 0 },
    });

    if (existing) {
      await ClimbHistory.deleteOne({ _id: existing._id });
      return {
        statusCode: 200,
        body: { success: true, data: { climbHistory: null } },
      };
    }
  }

  const climbHistory = await ClimbHistory.findOneAndUpdate(
    { climb: new Types.ObjectId(climb) },
    {
      $set: { isProject },
      $setOnInsert: {
        climb: new Types.ObjectId(climb),
        location: new Types.ObjectId(location),
        sector: new Types.ObjectId(sector),
        status: 'attempt',
      },
    },
    { new: true, upsert: true }
  );

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
      data: { climbHistory: toApiClimbHistory(populated) },
    },
  };
});

export { handler };
