import type {
  CollaboratorPutParams,
  CollaboratorPutRequest,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import type { SectorsCollaboratorsResponse } from '@jrposada/fit-log-shared/models/sectors/sectors-collaborators';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { addSectorCollaborator } from '../../../services/sector.ts';
import { toApiResponse } from '../../infrastructure/api-utils.ts';
import { toApiSector } from '../../mappers/sectors.ts';

const handler = toApiResponse<
  SectorsCollaboratorsResponse,
  CollaboratorPutParams,
  unknown,
  CollaboratorPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id, userId } = request.params;
  const { permission } = request.body;

  const sector = await addSectorCollaborator(
    request.user,
    id,
    userId,
    permission
  );

  return {
    statusCode: 200,
    body: { success: true, data: { sector: toApiSector(sector) } },
  };
});

export { handler };
