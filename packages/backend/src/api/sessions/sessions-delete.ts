import { SessionsDeleteResponse } from '@shared/models/session';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';
import { SessionsService } from '../../services/sessions-service';
import { apiHandler } from '../api-utils';

export const handler = apiHandler<SessionsDeleteResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(req);
    const { userId } = authorizerContext;

    assert(SessionsService.getUserId(id) === userId, { msg: 'Unauthorized' });

    void (await SessionsService.instance.delete(id));

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
