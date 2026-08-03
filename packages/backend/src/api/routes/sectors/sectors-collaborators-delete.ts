import type { CollaboratorDeleteParams } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import type { SectorsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/sectors/sectors-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { removeSectorCollaborator } from '../../../services/sector.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiSector } from '../../mappers/sectors.ts';

const handler = toRequestHandler<
  SectorsCollaboratorsResponse,
  CollaboratorDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;

  const sector = await removeSectorCollaborator(request.user, id, userId);

  return {
    statusCode: 200,
    body: { success: true, data: { sector: toApiSector(sector) } },
  };
});

export { handler };
