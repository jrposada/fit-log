import {
  SectorsBatchPutRequest,
  SectorsBatchPutResponse,
} from '@shared/models/sector/sector-batch-put';
import { assert } from '@shared/utils/assert';
import mongoose, { ClientSession, Types } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { IModel3D } from '../../models/model3d';
import { Sector } from '../../models/sector';
import { IUser } from '../../models/user';
import {
  batchUpsertOwnedDocument,
  BatchUpsertOwnedItem,
} from '../../utils/batch-upsert-owned-document';
import { toApiResponse } from '../api-utils';
import { toApiSector } from './sectors-mapper';

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
    .populate<{ climbs: IClimb[]; images: IImage[]; models3d: IModel3D[] }>([
      'images',
      'models3d',
      'climbs',
    ])
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
        models3d: sectorPutData.models3d.map(
          (modelId: string) => new Types.ObjectId(modelId)
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
