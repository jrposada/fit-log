import { ClimbsGetByIdResponse } from '@shared/models/climb';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';

import { ClimbsService } from '../../../services/climbs-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<ClimbsGetByIdResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(req);

    const climb = await ClimbsService.instance.get(id);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: {
          climb: {
            id: climb.SK,
            location: climb.location,
            holds: climb.holds.map((hold) => ({
              x: hold.x,
              y: hold.y,
            })),
            name: climb.name,
            grade: climb.grade,
            description: climb.description,
            sector: climb.sector,
            createdAt: climb.createdAt,
            updatedAt: climb.updatedAt,
          },
        },
      },
    };
  }
);

function validateEvent(req: Request): {
  id: string;
} {
  if (!req.params?.id) {
    throw new Error('Invalid request');
  }

  return { id: req.params.id };
}
