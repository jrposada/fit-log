import type {
  SectorsPutRequest,
  SectorsPutResponse,
} from '@jrposada/fit-log-shared/models/sector/sector-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Types } from 'mongoose';

import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import type { IClimb } from '../../models/climb.ts';
import type { IImage } from '../../models/image.ts';
import { Sector } from '../../models/sector.ts';
import { upsertOwnedDocument } from '../../utils/upsert-owned-document.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiSector } from './sectors-mapper.ts';

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
