import { LocationsDeleteResponse } from '@shared/models/location';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';

import { LocationsService } from '../../../services/locations-service';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<LocationsDeleteResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { id } = validateEvent(req);

    void (await LocationsService.instance.delete(id));

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
