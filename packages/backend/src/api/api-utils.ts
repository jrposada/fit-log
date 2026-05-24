import { ApiResponse } from '@shared/models/api-response';
import { Request, Response } from 'express';

import ForbiddenError from '../infrastructure/forbidden-error.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';

function handleApiError<TError = unknown>(error: TError, res: Response) {
  console.error('API Error:', error);
  const body: ApiResponse = {
    data: undefined,
    success: false,
  };

  let status = 500;
  if (error instanceof ForbiddenError) status = 403;
  else if (error instanceof ResourceNotFound) status = 404;

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
