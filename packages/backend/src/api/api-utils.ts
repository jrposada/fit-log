import { ApiResponse } from '@shared/models/api-response';
import { Request, Response, NextFunction } from 'express';
import { AuthorizerContext } from '../lambdas/authorizer/authorizer';

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

type ApiHandlerParams<TData> = ({
  authorizerContext,
  req,
  res,
}: {
  authorizerContext?: AuthorizerContext;
  req: Request;
  res: Response;
}) => Promise<{
  body: ApiResponse<TData>;
  headers?: Record<string, string>;
  statusCode: number;
}>;

export function apiHandler<TData>(
  handler: ApiHandlerParams<TData>
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let authorizerContext: AuthorizerContext | undefined;

      // Extract auth context from request (will be set by auth middleware)
      if (req.user) {
        authorizerContext = req.user as AuthorizerContext;
      }

      const { body, statusCode, headers } = await handler({
        req,
        res,
        authorizerContext,
      });

      // Set custom headers if provided
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }

      res.status(statusCode).json(body);
    } catch (error) {
      console.error(error);
      apiError(error, res);
    }
  };
}
