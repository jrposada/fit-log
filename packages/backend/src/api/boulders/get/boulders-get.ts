import { Boulder, BouldersGetResponse } from '@shared/models/boulder';
import { ApiResponse } from '@shared/models/api-response';
import { assert } from '@shared/utils/assert';

import { DbRecord } from '../../../services/aws/db-record';
import { BouldersService } from '../../../services/boulders-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<BouldersGetResponse>(
  async ({ authorizerContext }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { items: boulders, lastEvaluatedKey } =
      await BouldersService.instance.getAll(
        BouldersService.instance.calculatePartialSk()
      );

    return {
      statusCode: 200,
      body: calculateApiResponse({
        lastEvaluatedKey,
        boulders,
      }),
    };
  }
);

type CalculateApiResponseParams = {
  lastEvaluatedKey: Awaited<
    ReturnType<typeof BouldersService.instance.getAll>
  >['lastEvaluatedKey'];
  boulders: DbRecord<'boulder'>[];
};

function calculateApiResponse({
  lastEvaluatedKey,
  boulders,
}: CalculateApiResponseParams): ApiResponse<BouldersGetResponse> {
  return {
    success: true,
    data: {
      lastEvaluatedKey,
      boulders: boulders.map<Boulder>((item) => ({
        id: item.SK,
        image: item.image,
        holds: item.holds.map((hold) => ({
          x: hold.x,
          y: hold.y,
        })),
        name: item.name,
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    },
  };
}
