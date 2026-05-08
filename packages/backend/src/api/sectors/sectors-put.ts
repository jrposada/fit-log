import {
  SectorsPutRequest,
  SectorsPutResponse,
} from '@shared/models/sector/sector-put';
import { assert } from '@shared/utils/assert';
import { Types } from 'mongoose';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { Sector } from '../../models/sector';
import { upsertOwnedDocument } from '../../utils/upsert-owned-document';
import { toApiResponse } from '../api-utils';
import { toApiSector } from './sectors-mapper';

const handler = toApiResponse<
  SectorsPutResponse,
  unknown,
  unknown,
  SectorsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const sectorPutData = request.body;

  const sector = await upsertOwnedDocument(
    Sector,
    sectorPutData.id,
    request.user,
    {
      /* Data */
      name: sectorPutData.name,
      description: sectorPutData.description,
      isPrimary: sectorPutData.isPrimary,
      latitude: sectorPutData.latitude,
      longitude: sectorPutData.longitude,
      googleMapsId: sectorPutData.googleMapsId,

      /* References */
      images: sectorPutData.images.map(
        (imageId) => new Types.ObjectId(imageId)
      ),
      climbs: sectorPutData.climbs.map(
        (climbId) => new Types.ObjectId(climbId)
      ),
    }
  )
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{ climbs: IClimb[]; images: IImage[] }>(['images', 'climbs']);

  if (!sector) {
    throw new ResourceNotFound(
      `Sector ${sectorPutData.id ?? ''} not found or not editable`
    );
  }

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        sector: toApiSector(sector),
      },
    },
  };
});

export { handler };
