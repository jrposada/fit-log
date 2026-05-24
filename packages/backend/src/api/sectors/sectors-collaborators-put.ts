import type {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import type { SectorsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/sector/sector-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import type { PopulatedOwnership } from '../../auth/ownership-populate.ts';
import { OWNERSHIP_POPULATE } from '../../auth/ownership-populate.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import type { IClimb } from '../../models/climb.ts';
import type { IImage } from '../../models/image.ts';
import { Sector } from '../../models/sector.ts';
import { addOrUpdateCollaborator } from '../../utils/collaborator-mutators.ts';
import { toApiResponse } from '../api-utils.ts';
import { toApiSector } from './sectors-mapper.ts';

const handler = toApiResponse<
  SectorsCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const sector = await addOrUpdateCollaborator(
    Sector,
    id,
    userId,
    permission,
    request.user
  )
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
