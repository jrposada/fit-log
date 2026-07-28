import type {
  ClimbsGetQuery,
  ClimbsGetResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Types } from 'mongoose';

import type { ClimbsCursor } from '../../../services/climb.ts';
import { getClimbs } from '../../../services/climb.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiClimb } from '../../mappers/climbs.ts';

function decodeCursor(raw: string): ClimbsCursor | null {
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as ClimbsCursor;
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

function encodeCursor(cursor: ClimbsCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

const handler = toApiResponse<ClimbsGetResponse, unknown, ClimbsGetQuery>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { cursor, ...filters } = request.query;

    const { climbs, nextCursor } = await getClimbs({
      ...filters,
      cursor: cursor ? decodeCursor(cursor) : null,
    });

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climbs: climbs.map(toApiClimb),
          nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
        },
      },
    };
  }
);

export { handler };
