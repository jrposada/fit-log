import { Climb, ClimbsGetResponse } from '@shared/models/climb';
import { ApiResponse } from '@shared/models/api-response';
import { assert } from '@shared/utils/assert';

import { DbRecord } from '../../../services/aws/db-record';
import { ClimbsService } from '../../../services/climbs-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<ClimbsGetResponse>(
  async ({ authorizerContext }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { items: climbs, lastEvaluatedKey } =
      await ClimbsService.instance.getAll(
        ClimbsService.instance.calculatePartialSk()
      );

    return {
      statusCode: 200,
      body: calculateApiResponse({
        lastEvaluatedKey,
        climbs,
      }),
    };
  }
);

type CalculateApiResponseParams = {
  lastEvaluatedKey: Awaited<
    ReturnType<typeof ClimbsService.instance.getAll>
  >['lastEvaluatedKey'];
  climbs: DbRecord<'climb'>[];
};

function calculateApiResponse({
  lastEvaluatedKey,
  climbs,
}: CalculateApiResponseParams): ApiResponse<ClimbsGetResponse> {
  return {
    success: true,
    data: {
      lastEvaluatedKey,
      climbs: climbs.map<Climb>((item) => ({
        id: item.SK,
        holds: item.holds.map((hold) => ({
          x: hold.x,
          y: hold.y,
        })),
        name: item.name,
        grade: item.grade,
        description: item.description,
        sector: item.sector,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    },
  };
}
