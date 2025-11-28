import {
  SectorsGetByIdParams,
  SectorsGetByIdResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';

import ResourceNotFound from '../../infrastructure/not-found-error';
import { Sector } from '../../models/sector';
import { toApiResponse } from '../api-utils';
import { toApiSector } from './sectors-mapper';

const handler = toApiResponse<SectorsGetByIdResponse, SectorsGetByIdParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    const sector = await Sector.findById(id);

    if (!sector) {
      throw new ResourceNotFound(`Sector with id ${id} not found`);
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
  }
);

export { handler };
