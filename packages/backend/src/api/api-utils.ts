import { ApiErrorCode } from '@jrposada/fit-log-shared/models/api-error-code';
import type { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import type { RelatedEntityRequired } from '@jrposada/fit-log-shared/models/errors/related-entity-required';
import type { Request, Response } from 'express';

import ForbiddenError from '../infrastructure/forbidden-error.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import RelatedEntityRequiredError from '../infrastructure/related-entity-required-error.ts';

function handleApiError<TError = unknown>(error: TError, res: Response) {
  console.error('API Error:', error);

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

type ApiResponseResult<TData = unknown> = {
  statusCode: number;
  body: ApiResponse<TData>;
  headers?: Record<string, string>;
};

export function toApiResponse<
  TData,
  TParams = unknown,
  TQuery = unknown,
  TBody = unknown,
>(
  handler: (
    req: Request<TParams, unknown, TBody, TQuery>
  ) => Promise<ApiResponseResult<TData>>
) {
  return async (req: Request, res: Response) => {
    try {
      const { statusCode, body, headers } = await handler(
        req as Request<TParams, unknown, TBody, TQuery>
      );

      // Set custom headers if provided
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }

      res.status(statusCode).json(body);
    } catch (error) {
      handleApiError(error, res);
    }
  };
}
