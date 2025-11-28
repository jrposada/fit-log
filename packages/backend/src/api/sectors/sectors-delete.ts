import {
  SectorsDeleteParams,
  SectorsDeleteResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';

import { Sector } from '../../models/sector';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<SectorsDeleteResponse, SectorsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const { id } = request.params;

    await Sector.deleteOne({ _id: id });

    return {
      statusCode: 200,
      body: {
        success: true,
        data: undefined,
      },
    };
  }
);

export { handler };
