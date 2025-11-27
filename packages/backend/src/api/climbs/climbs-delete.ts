import { ClimbsDeleteParams } from '@shared/models/climb';
import { ClimbsService } from '../../services/climbs-service';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse<ClimbsDeleteParams>(async (request) => {
  const { id } = request.params;

  void (await ClimbsService.instance.delete(id));

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
