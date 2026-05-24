import type {
  SectorsBatchPutRequest,
  SectorsBatchPutResponse,
} from '@jrposada/fit-log-shared/models/sector/sector-batch-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import type { ClientSession } from 'mongoose';
import mongoose, { Types } from 'mongoose';

import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import type { IClimb } from '../../models/climb.ts';
import type { IImage } from '../../models/image.ts';
import { Sector } from '../../models/sector.ts';
import type { IUser } from '../../models/user.ts';
import type { BatchUpsertOwnedItem } from '../../utils/batch-upsert-owned-document.ts';
import { batchUpsertOwnedDocument } from '../../utils/batch-upsert-owned-document.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiSector } from './sectors-mapper.ts';

async function upsertSectorsBatch(
  session: ClientSession,
  items: BatchUpsertOwnedItem<typeof Sector.prototype>[],
  user: IUser
) {
  const { ids, matchedCount } = await batchUpsertOwnedDocument(
    Sector,
    items,
    user,
    session
  );

  if (matchedCount < items.length) {
    throw new ResourceNotFound(
      `Some sectors not found or not editable (matched ${matchedCount}/${items.length})`
    );
  }

  const savedSectors = await Sector.find({ _id: { $in: ids } })
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{ climbs: IClimb[]; images: IImage[] }>(['images', 'climbs'])
    .session(session);

  // Preserve input order so the response aligns with the request batch.
  const byId = new Map(savedSectors.map((s) => [s._id.toString(), s]));
  return ids.flatMap((id) => {
    const s = byId.get(id.toString());
    return s ? [s] : [];
  });
}

const handler = toApiResponse<
  SectorsBatchPutResponse,
  never,
  never,
  SectorsBatchPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });
  const user = request.user;

  const { sectors: sectorsData } = request.body;

  const items = sectorsData.map<BatchUpsertOwnedItem<typeof Sector.prototype>>(
    (sectorPutData) => ({
      id: sectorPutData.id,
      data: {
        /* Data */
        name: sectorPutData.name,
        description: sectorPutData.description,
        isPrimary: sectorPutData.isPrimary,
        latitude: sectorPutData.latitude,
        longitude: sectorPutData.longitude,
        googleMapsId: sectorPutData.googleMapsId,

        /* References */
        images: sectorPutData.images.map(
          (imageId: string) => new Types.ObjectId(imageId)
        ),
        climbs: sectorPutData.climbs.map(
          (climbId: string) => new Types.ObjectId(climbId)
        ),
      },
    })
  );

  const session = await mongoose.startSession();
  try {
    // withTransaction (callback) over manual startTransaction/commit/abort:
    // it auto-retries on transient transaction errors (e.g. write conflicts).
    const ordered = await session.withTransaction((s) =>
      upsertSectorsBatch(s, items, user)
    );

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          sectors: ordered.map(toApiSector),
        },
      },
    };
  } finally {
    await session.endSession();
  }
});

export { handler };
