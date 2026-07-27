import type {
  ClimbHistoriesPutRequest,
  ClimbHistoriesPutResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { MergeType } from 'mongoose';
import { Types } from 'mongoose';

import RelatedEntityRequiredError from '../../../infrastructure/related-entity-required-error.ts';
import type { IClimb } from '../../../models/climb.ts';
import type { IClimbHistoryTry } from '../../../models/climb-history.ts';
import {
  ClimbHistory,
  computeTopStatus,
} from '../../../models/climb-history.ts';
import type { IClimbingSession } from '../../../models/climbing-session.ts';
import type { IImage } from '../../../models/image.ts';
import type { ILocation } from '../../../models/location.ts';
import type { ISector } from '../../../models/sector.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { recomputeClimbingSessionSummary } from '../climbing-sessions/climbing-sessions-summary.ts';
import { toApiClimbHistory } from './climb-histories-mapper.ts';
import { hasValidRefs } from './climb-histories-utils.ts';

const handler = toApiResponse<
  ClimbHistoriesPutResponse,
  unknown,
  unknown,
  ClimbHistoriesPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const {
    tryId,
    status,
    attempts,
    notes,
    date,
    climb,
    location,
    sector,
    climbingSession,
    forced,
  } = request.body;

  if (!tryId && !climbingSession && !forced) {
    throw new RelatedEntityRequiredError('climbingSession', true);
  }

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
        owner: request.user._id,
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
      { climb: new Types.ObjectId(climb), owner: request.user._id },
      {
        $push: { tries: newTry },
        $setOnInsert: {
          climb: new Types.ObjectId(climb),
          location: new Types.ObjectId(location),
          sector: new Types.ObjectId(sector),
          owner: request.user._id,
          climbingSession: climbingSession
            ? new Types.ObjectId(climbingSession)
            : null,
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
    })
    .populate<{ climbingSession: IClimbingSession | null }>('climbingSession');

  assert(populated, { msg: 'ClimbHistory not found after save' });
  if (!hasValidRefs(populated)) {
    throw new Error('ClimbHistory references deleted documents');
  }

  if (populated.climbingSession) {
    await recomputeClimbingSessionSummary(populated.climbingSession._id);
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
