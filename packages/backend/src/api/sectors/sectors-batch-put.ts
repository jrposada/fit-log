import {
  SectorsBatchPutRequest,
  SectorsBatchPutResponse,
} from '@shared/models/sector/sector-batch-put';
import { assert } from '@shared/utils/assert';
import { Types } from 'mongoose';

import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { ISector, Sector } from '../../models/sector';
import {
  batchUpsertDocument,
  BatchUpsertItem,
} from '../../utils/batch-upsert-document';
import { toApiResponse } from '../api-utils';
import { toApiSector } from './sectors-mapper';

const handler = toApiResponse<
  SectorsBatchPutResponse,
  never,
  never,
  SectorsBatchPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { sectors: sectorsData } = request.body;

  const items = sectorsData.map<BatchUpsertItem<ISector>>((sectorPutData) => ({
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
  }));

  const ids = await batchUpsertDocument(Sector, items);
  const savedSectors = await Sector.find({ _id: { $in: ids } }).populate<{
    climbs: IClimb[];
    images: IImage[];
  }>(['images', 'climbs']);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        sectors: savedSectors.map(toApiSector),
      },
    },
  };
});

export { handler };
