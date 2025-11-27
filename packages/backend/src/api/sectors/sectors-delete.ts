import {
  SectorsDeleteParams,
  SectorsDeleteResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { SectorsService } from '../../services/sectors-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<SectorsDeleteResponse, SectorsDeleteParams>(
  async (request) => {
    assert(request.user, { msg: 'Unauthorized' });

    const params = request.params;

    void (await SectorsService.instance.delete(params.id));

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          success: true,
        },
      },
    };
  }
);

export { handler };
