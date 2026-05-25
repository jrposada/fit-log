import type {
  TrainingSessionsPutRequest,
  TrainingSessionsPutResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Types } from 'mongoose';

import { editableBy } from '../../auth/editable-filter.ts';
import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import type { IClimbHistory } from '../../models/climb-history.ts';
import type { ILocation } from '../../models/location.ts';
import { TrainingSession } from '../../models/training-session.ts';
import { toApiResponse } from '../api-utils.ts';
import { hasRequiredClimbHistoryRefs } from '../climb-histories/climb-histories-utils.ts';
import { toApiTrainingSession } from './training-sessions-mapper.ts';

const handler = toApiResponse<
  TrainingSessionsPutResponse,
  unknown,
  unknown,
  TrainingSessionsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const body = request.body;
  const userId = request.user._id as Types.ObjectId;

  let sessionId: Types.ObjectId;

  if (body.id) {
    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = body.title;
    if (body.notes !== undefined) update.notes = body.notes;
    if (body.location !== undefined) {
      update.location = body.location
        ? new Types.ObjectId(body.location)
        : null;
    }

    const updated = await TrainingSession.findOneAndUpdate(
      { _id: body.id, ...editableBy(request.user) },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new ResourceNotFound(
        `Training session ${body.id} not found or not editable`
      );
    }
    sessionId = updated._id;
  } else {
    const now = new Date();
    const created = await TrainingSession.create({
      owner: userId,
      collaborators: [],
      title: body.title,
      notes: body.notes,
      location: body.location ? new Types.ObjectId(body.location) : undefined,
      startedAt: now,
      lastActivityAt: now,
      climbHistories: [],
    });
    sessionId = created._id;
  }

  const session = await TrainingSession.findById(sessionId)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{ location: ILocation | null; climbHistories: IClimbHistory[] }>([
      'location',
      'climbHistories',
    ]);

  if (!session) {
    throw new ResourceNotFound(
      `Training session ${sessionId.toString()} not found`
    );
  }

  const sessionWithValidClimbHistories = Object.assign(session, {
    climbHistories: session.climbHistories.filter(hasRequiredClimbHistoryRefs),
  });

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        trainingSession: toApiTrainingSession(sessionWithValidClimbHistories),
      },
    },
  };
});

export { handler };
