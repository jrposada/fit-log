import { ApiErrorCode } from '@jrposada/fit-log-shared/models/api-error-code';
import type { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import type { RelatedEntityRequired } from '@jrposada/fit-log-shared/models/errors/related-entity-required';
import type { Response } from 'express';

import ForbiddenError from '../../infrastructure/forbidden-error.ts';
import Logger from '../../infrastructure/logger.ts';
import ResourceNotFound from '../../infrastructure/not-found-error.ts';
import RelatedEntityRequiredError from '../../infrastructure/related-entity-required-error.ts';

export function handleApiError<TError = unknown>(error: TError, res: Response) {
  Logger.error('API Error:', error);

  let status = 500;
  const body: ApiResponse<unknown> = {
    data: undefined,
    success: false,
  };

  if (error instanceof ForbiddenError) {
    status = 403;
  } else if (error instanceof ResourceNotFound) {
    status = 404;
  } else if (error instanceof RelatedEntityRequiredError) {
    status = 428;
    body.data = {
      code: ApiErrorCode.RelatedEntityRequired,
      entity: error.entity,
      forcible: error.forcible,
    } as RelatedEntityRequired;
  }

  res.status(status).json(body);
}
