import {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@shared/models/auth/collaborator-put';
import { SectorsCollaboratorsResponse } from '@shared/models/sector/sector-collaborators';
import { assert } from '@shared/utils/assert';

import {
  OWNERSHIP_POPULATE,
  PopulatedOwnership,
} from '../../auth/ownership-populate';
import ResourceNotFound from '../../infrastructure/not-found-error';
import { IClimb } from '../../models/climb';
import { IImage } from '../../models/image';
import { IModel3D } from '../../models/model3d';
import { Sector } from '../../models/sector';
import { addOrUpdateCollaborator } from '../../utils/collaborator-mutators';
import { toApiResponse } from '../api-utils';
import { toApiSector } from './sectors-mapper';

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
    .populate<{ climbs: IClimb[]; images: IImage[]; models3d: IModel3D[] }>([
      'images',
      'models3d',
      'climbs',
    ]);

  if (!sector) {
    throw new ResourceNotFound(`Sector ${id} not found or not editable`);
  }

  return {
    statusCode: 200,
    body: { success: true, data: { sector: toApiSector(sector) } },
  };
});

export { handler };
