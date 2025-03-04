import { ApiResponse } from '@shared/models/api-response';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export function apiError<TError = unknown>(
  _error: TError
): APIGatewayProxyResult {
  const body: ApiResponse = {
    data: undefined,
    success: false,
  };

  return apiResponse({
    body: JSON.stringify(body),
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
        headers,
        multiValueHeaders,
        statusCode,
      });
    } catch (error) {
      console.error(error);
      return apiError(error);
    }
  };
}

type ApiResponseParams = {
  body?: string;
  headers?: APIGatewayProxyResult['headers'];
  multiValueHeaders?: APIGatewayProxyResult['multiValueHeaders'];
  statusCode: number;
};
export function apiResponse({
  body,
  headers,
  multiValueHeaders,
  statusCode,
}: ApiResponseParams): APIGatewayProxyResult {
  const response: APIGatewayProxyResult = {
    body: body ?? '',
    headers: {
      ...headers,
      'Content-Type': 'aplication/json',
      'Access-Control-Allow-Origin': `https://${process.env.ALLOWED_ORIGIN!}`,
      'Access-Control-Allow-Credentials': true,
    },
    multiValueHeaders,
    statusCode,
  };
  return response;
}
