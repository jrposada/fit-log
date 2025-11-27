import {
  Climb,
  ClimbsGetParams,
  climbsGetParamsSchema,
  ClimbsGetResponse,
} from '@shared/models/climb';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';

import { ClimbsService } from '../../../services/climbs-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<ClimbsGetResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { params } = validateEvent(req);

    const { items: climbs, lastEvaluatedKey } =
      await ClimbsService.instance.getAll(
        ClimbsService.instance.calculatePartialSk(),
        params.limit
      );

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          lastEvaluatedKey,
          climbs: climbs.map<Climb>((item) => ({
            id: item.SK,
            location: item.location,
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
      },
    };
  }
);

function validateEvent(req: Request): {
  params: ClimbsGetParams;
} {
  try {
    const params = climbsGetParamsSchema.parse(req.query ?? {});
    return { params };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
