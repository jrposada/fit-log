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
  body: ApiResponse<TData>;
  headers?: ApiResponseParams['headers'];
  multiValueHeaders?: ApiResponseParams['multiValueHeaders'];
  statusCode: number;
}>;
export function apiHandler<TData>(
  handler: ApiHandlerParams<TData>
): (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> {
  return async (event: APIGatewayProxyEvent) => {
    try {
      const { body, statusCode, headers, multiValueHeaders } =
        await handler(event);
      return apiResponse({
        body: JSON.stringify(body),
        event,
        headers,
        multiValueHeaders,
        statusCode,
      });
    } catch (error) {
      console.error(error);
      return apiError(event, error);
    }
  };
}

type ApiResponseParams = {
  body?: string;
  event: APIGatewayProxyEvent;
  headers?: APIGatewayProxyResult['headers'];
  multiValueHeaders?: APIGatewayProxyResult['multiValueHeaders'];
  statusCode: number;
};
export function apiResponse({
  body,
  event,
  headers,
  multiValueHeaders,
  statusCode,
}: ApiResponseParams): APIGatewayProxyResult {
  const response: APIGatewayProxyResult = {
    body: body ?? '',
    headers: {
      ...headers,
      'Content-Type': 'aplication/json',
      'Access-Control-Allow-Origin': calculateAllowedOrigin(
        event.headers.origin
      ),
      'Access-Control-Allow-Credentials': true,
    },
    multiValueHeaders,
    statusCode,
  };
  return response;
}

export function calculateAllowedOrigin(domain: string = ''): string {
  return ALLOWED_ORIGINS.includes(domain) ? domain : ALLOWED_ORIGIN_DEFAULT;
}
