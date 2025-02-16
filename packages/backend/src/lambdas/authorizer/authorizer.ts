import { CognitoJwtVerifier } from 'aws-jwt-verify';
import {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResult,
  APIGatewayProxyEvent,
  Callback,
  Context,
  CustomAuthorizerResult,
  StatementEffect,
} from 'aws-lambda';

const verifier = CognitoJwtVerifier.create({
  clientId: process.env.CLIENT_ID!,
  tokenUse: 'access',
  userPoolId: process.env.USER_POOL_ID!,
});

export const handler = async (
  event: APIGatewayProxyEvent & APIGatewayAuthorizerEvent,
  context: Context,
  callback: Callback<APIGatewayAuthorizerResult>
): Promise<APIGatewayAuthorizerResult> => {
  console.log({ event });
  console.log({ context });
  const accessToken = validateCookies(event.headers.Cookie);

  try {
    await verifier.verify(accessToken, {
      clientId: process.env.CLIENT_ID!,
      tokenUse: 'access',
    });
    const policy = generatePolicy('user', 'Allow', event.methodArn);
    callback(null, policy);
    return policy;
  } catch (e) {
    console.error(e);
    callback('Unauthorized');
  }
};

/**
 * Validate authorization cookies
 * @param cookies String with all cookies separated by `;`
 * @returns Access Token
 */
function validateCookies(cookies: string | undefined): string {
  if (!cookies) {
    throw new Error('Missing cookies');
  }

  // Each cookie is in the form "key=value"
  for (const cookie of cookies.split(';')) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith('accessToken=')) {
      return trimmedCookie.substring('accessToken='.length);
    }
  }

  throw new Error('Missing auth cookie');
}

// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
// https://github.com/aws-samples/openbanking-brazilian-auth-samples/blob/main/resources/lambda/lambda-auth.js
// Helper function to generate an IAM policy
function generatePolicy(
  principalId: string,
  effect: StatementEffect,
  resource: string,
  context: 
): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };
}
