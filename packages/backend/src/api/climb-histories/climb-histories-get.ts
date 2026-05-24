import {
  ClimbHistoriesGetQuery,
  ClimbHistoriesGetResponse,
} from '@jrposada/fit-log-shared/models/climb-history/climb-history-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { MergeType, Types } from 'mongoose';

import { IClimb } from '../../models/climb.ts';
import { ClimbHistory } from '../../models/climb-history.ts';
import { IImage } from '../../models/image.ts';
import { ILocation } from '../../models/location.ts';
import { ISector } from '../../models/sector.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiClimbHistory } from './climb-histories-mapper.ts';
import { hasValidRefs } from './climb-histories-utils.ts';

const DEFAULT_LIMIT = 20;

type Cursor = { updatedAt: string; id: string };

function decodeCursor(raw: string): Cursor | null {
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as Cursor;
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

function encodeCursor(cursor: Cursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

const handler = toApiResponse<
  ClimbHistoriesGetResponse,
  unknown,
  ClimbHistoriesGetQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const {
    limit,
    cursor,
    climbId,
    locationId,
    sectorId,
    status,
    startDate,
    endDate,
  } = request.query;

  // Split 'project' out of status array into an isProject filter
  const includeProjects = status?.includes('project') ?? false;
  const dbStatuses = status?.filter((s) => s !== 'project');

  const baseFilter: Record<string, unknown> = {
    owner: request.user._id,
    ...(climbId ? { climb: climbId } : {}),
    ...(locationId ? { location: locationId } : {}),
    ...(sectorId ? { sector: sectorId } : {}),
    ...(startDate || endDate
      ? {
          updatedAt: {
            ...(startDate ? { $gte: new Date(startDate) } : {}),
            ...(endDate ? { $lte: new Date(endDate) } : {}),
          },
        }
      : {}),
  };

  const statusClauses: Record<string, unknown>[] = [];
  if (dbStatuses?.length && includeProjects) {
    statusClauses.push({
      $or: [
        { status: { $in: dbStatuses } },
        { isProject: true, status: { $nin: ['send', 'flash'] } },
      ],
    });
  } else if (dbStatuses?.length) {
    baseFilter.status = { $in: dbStatuses };
  } else if (includeProjects) {
    baseFilter.isProject = true;
  }

  const decodedCursor = cursor ? decodeCursor(cursor) : null;
  if (decodedCursor) {
    const cursorDate = new Date(decodedCursor.updatedAt);
    const cursorId = new Types.ObjectId(decodedCursor.id);
    statusClauses.push({
      $or: [
        { updatedAt: { $lt: cursorDate } },
        { updatedAt: cursorDate, _id: { $lt: cursorId } },
      ],
    });
  }

  if (statusClauses.length > 0) {
    baseFilter.$and = statusClauses;
  }

  const pageSize = limit ?? DEFAULT_LIMIT;

  const climbHistories = await ClimbHistory.find(baseFilter)
    .sort({ updatedAt: -1, _id: -1 })
    .limit(pageSize + 1)
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

  const hasMore = climbHistories.length > pageSize;
  const pageHistories = hasMore
    ? climbHistories.slice(0, pageSize)
    : climbHistories;

  const validHistories = pageHistories.filter(hasValidRefs);

  const last = pageHistories[pageHistories.length - 1];
  const nextCursor =
    hasMore && last
      ? encodeCursor({
          updatedAt: last.updatedAt.toISOString(),
          id: last._id.toString(),
        })
      : null;

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        climbHistories: validHistories.map(toApiClimbHistory),
        nextCursor,
      },
    },
  };
});

export { handler };
