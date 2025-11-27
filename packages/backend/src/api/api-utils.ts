import { ApiResponse } from '@shared/models/api-response';
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function apiError<TError = unknown>(
  _error: TError,
  res: Response
): Response {
  const body: ApiResponse = {
    data: undefined,
    success: false,
  };

  return res.status(500).json(body);
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
    } catch (error) {
      throw new Error('Invalid request parameters');
    }
  };
}

export function validateBody<TSchema extends ZodSchema>(schema: TSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      throw new Error('Invalid request body');
    }
  };
}

export function validateQuery<TSchema extends ZodSchema>(schema: TSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      throw new Error('Invalid query parameters');
    }
  };
}

// New middleware-based approach
type ApiResponseResult<TData = unknown> = {
  statusCode: number;
  body: ApiResponse<TData>;
  headers?: Record<string, string>;
};

export function toApiResponse<TParams = any, TQuery = any, TBody = any>(
  handler: (
    req: Request<TParams, any, TBody, TQuery>
  ) => Promise<ApiResponseResult>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { statusCode, body, headers } = await handler(
        req as Request<TParams, any, TBody, TQuery>
      );

      // Set custom headers if provided
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }

      res.status(statusCode).json(body);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
