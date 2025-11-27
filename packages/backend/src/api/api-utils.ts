import { ApiResponse } from '@shared/models/api-response';
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

function apiError<TError = unknown>(_error: TError, res: Response) {
  const body: ApiResponse = {
    data: undefined,
    success: false,
  };

  res.status(500).json(body);
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new Error('Unauthorized');
  }
  next();
}

export function validateParams<TSchema extends ZodSchema>(schema: TSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch {
      throw new Error('Invalid request parameters');
    }
  };
}

export function validateBody<TSchema extends ZodSchema>(schema: TSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch {
      throw new Error('Invalid request body');
    }
  };
}

export function validateQuery<TSchema extends ZodSchema>(schema: TSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch {
      throw new Error('Invalid query parameters');
    }
  };
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
