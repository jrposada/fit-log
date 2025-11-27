import {
  SectorsDeleteParams,
  sectorsDeleteParamsSchema,
  SectorsDeleteResponse,
} from '@shared/models/sector';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';

import { SectorsService } from '../../services/sectors-service';
import { apiHandler } from '../api-utils';

export const handler = apiHandler<SectorsDeleteResponse>(
  async ({ authorizerContext, req }) => {
    assert(authorizerContext, { msg: 'Unauthorized' });

    const { params } = validateEvent(req);

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

function validateEvent(req: Request): {
  params: SectorsDeleteParams;
} {
  try {
    const params = sectorsDeleteParamsSchema.parse(req.params ?? {});
    return { params };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid request');
  }
}
