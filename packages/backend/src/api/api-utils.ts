import { ApiResponse } from '@shared/src/models/api-response';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ALLOWED_ORIGIN_DEFAULT, ALLOWED_ORIGINS } from './api-constants';

export function apiError<TError = unknown>(
  event: APIGatewayProxyEvent,
  _error: TError
): APIGatewayProxyResult {
  const body: ApiResponse = {
    data: undefined,
    success: false,
  };

  return apiResponse({
    body: JSON.stringify(body),
    event,
    statusCode: 500,
  });
}

type ApiHandlerParams<TData> = (event: APIGatewayProxyEvent) => Promise<{
  statusCode: number;
  body: ApiResponse<TData>;
}>;
export function apiHandler<TData>(
  handler: ApiHandlerParams<TData>
): (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> {
  return async (event: APIGatewayProxyEvent) => {
    try {
      const { body, statusCode } = await handler(event);
      return apiResponse({ event, statusCode, body: JSON.stringify(body) });
    } catch (error) {
      console.error(error);
      return apiError(event, error);
    }
  };
}

type ApiResponseParams = {
  body?: string;
  event: APIGatewayProxyEvent;
  statusCode: number;
};
export function apiResponse({
  body,
  event,
  statusCode,
}: ApiResponseParams): APIGatewayProxyResult {
  const response: APIGatewayProxyResult = {
    body: body ?? '',
    statusCode,
    headers: {
      'Content-Type': 'aplication/json',
      'Access-Control-Allow-Origin': calculateAllowedOrigin(
        event.headers.origin
      ),
      'Access-Control-Allow-Credentials': true,
    },
  };
  return response;
}

export function calculateAllowedOrigin(domain: string = ''): string {
  return ALLOWED_ORIGINS.includes(domain) ? domain : ALLOWED_ORIGIN_DEFAULT;
}
