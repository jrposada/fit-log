import type {
  SectorsPutRequest,
  SectorsPutResponse,
} from '@jrposada/fit-log-shared/models/sectors/sectors-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertSector } from '../../../services/sector.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiSector, toUpsertSectorInput } from '../../mappers/sectors.ts';

const handler = toRequestHandler<
  SectorsPutResponse,
  unknown,
  unknown,
  SectorsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const sector = await upsertSector(
    request.user,
    toUpsertSectorInput(request.body)
  );

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
