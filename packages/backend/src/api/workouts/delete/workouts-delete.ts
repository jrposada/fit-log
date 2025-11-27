import { WorkoutsDeleteResponse } from '@shared/models/workout';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';
import { WorkoutsService } from '../../../services/workouts-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<WorkoutsDeleteResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(req);
    const { userId } = authorizerContext;

    assert(WorkoutsService.getUserId(id) === userId, { msg: 'Unauthorized' });

    void (await WorkoutsService.instance.delete(id));

    return {
      statusCode: 200,
      body: {
        success: true,
        data: undefined,
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

  return { id: decodeURIComponent(req.params.id) };
}
