import type {
  ClimbHistoriesGetQuery,
  ClimbHistoriesGetResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Types } from 'mongoose';

import type { ClimbHistoriesCursor } from '../../../services/climb-history.ts';
import { getClimbHistories } from '../../../services/climb-history.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimbHistory } from '../../mappers/climb-histories.ts';

function decodeCursor(raw: string): ClimbHistoriesCursor | null {
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as ClimbHistoriesCursor;
    if (
      typeof parsed?.updatedAt !== 'string' ||
      typeof parsed?.id !== 'string' ||
      !Types.ObjectId.isValid(parsed.id) ||
      Number.isNaN(Date.parse(parsed.updatedAt))
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function encodeCursor(cursor: ClimbHistoriesCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

const handler = toApiResponse<
  ClimbHistoriesGetResponse,
  unknown,
  ClimbHistoriesGetQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { cursor, ...filters } = request.query;

  const { climbHistories, nextCursor } = await getClimbHistories(
    request.user._id,
    {
      ...filters,
      cursor: cursor ? decodeCursor(cursor) : null,
    }
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbHistories: climbHistories.map(toApiClimbHistory),
        nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
      },
    },
  };
});

export { handler };
