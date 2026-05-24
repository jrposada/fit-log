import type {
  ClimbHistoryProjectRequest,
  ClimbHistoryProjectResponse,
} from '@jrposada/fit-log-shared/models/climb-history/climb-history-project';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType } from 'mongoose';
import { Types } from 'mongoose';

import type { IClimb } from '../../models/climb.ts';
import { ClimbHistory } from '../../models/climb-history.ts';
import type { IImage } from '../../models/image.ts';
import type { ILocation } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiClimbHistory } from './climb-histories-mapper.ts';
import { hasValidRefs } from './climb-histories-utils.ts';

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
      owner: request.user._id,
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
    { climb: new Types.ObjectId(climb), owner: request.user._id },
    {
      $set: { isProject },
      $setOnInsert: {
        climb: new Types.ObjectId(climb),
        location: new Types.ObjectId(location),
        sector: new Types.ObjectId(sector),
        owner: request.user._id,
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
