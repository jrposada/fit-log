import { CollaboratorDeleteParams } from '@shared/models/auth/collaborator-delete';
import { SectorsCollaboratorsResponse } from '@shared/models/sector/sector-collaborators';
import { assert } from '@shared/utils/assert';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import { IClimb } from '../../models/climb.ts';
import { IImage } from '../../models/image.ts';
import { Sector } from '../../models/sector.ts';
import { removeCollaborator } from '../../utils/collaborator-mutators.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiSector } from './sectors-mapper.ts';

const handler = toApiResponse<
  SectorsCollaboratorsResponse,
  CollaboratorDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;

  const sector = await removeCollaborator(Sector, id, userId, request.user)
    .populate<PopulatedOwnership>([...OWNERSHIP_POPULATE])
    .populate<{ climbs: IClimb[]; images: IImage[] }>(['images', 'climbs']);

  if (!sector) {
    throw new ResourceNotFound(`Sector ${id} not found or not editable`);
  }

  return {
    statusCode: 200,
    body: { success: true, data: { sector: toApiSector(sector) } },
  };
});

export { handler };
