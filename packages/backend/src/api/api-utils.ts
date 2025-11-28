import { ApiResponse } from '@shared/models/api-response';
import { Request, Response } from 'express';

function apiError<TError = unknown>(_error: TError, res: Response) {
  const body: ApiResponse = {
    data: undefined,
    success: false,
  };

  res.status(500).json(body);
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
      apiError(error, res);
    }
  };
}
