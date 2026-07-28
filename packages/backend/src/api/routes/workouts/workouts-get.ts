import type {
  WorkoutsGetQuery,
  WorkoutsGetResponse,
} from '@jrposada/fit-log-shared/models/workout/workout-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Types } from 'mongoose';

import type { WorkoutsCursor } from '../../../services/workout.ts';
import { getWorkouts } from '../../../services/workout.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiWorkout } from '../../mappers/workouts.ts';

function decodeCursor(raw: string): WorkoutsCursor | null {
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as WorkoutsCursor;
    if (
      typeof parsed?.createdAt !== 'string' ||
      typeof parsed?.id !== 'string' ||
      !Types.ObjectId.isValid(parsed.id) ||
      Number.isNaN(Date.parse(parsed.createdAt))
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function encodeCursor(cursor: WorkoutsCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

const handler = toApiResponse<WorkoutsGetResponse, unknown, WorkoutsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { cursor, ...filters } = request.query;

    const { workouts, nextCursor } = await getWorkouts({
      ...filters,
      cursor: cursor ? decodeCursor(cursor) : null,
    });

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          workouts: workouts.map(toApiWorkout),
          nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
        },
      },
    };
  }
);

export { handler };
