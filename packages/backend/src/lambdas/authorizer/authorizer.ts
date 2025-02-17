import { CognitoJwtVerifier } from 'aws-jwt-verify';
import {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResult,
  APIGatewayProxyEvent,
  StatementEffect,
} from 'aws-lambda';
import dotenv from 'dotenv';

if (process.env.IS_OFFLINE) {
  const env = dotenv.config({ path: '.env.development' }).parsed;
  Object.assign(process.env, env);
}

const verifier = CognitoJwtVerifier.create({
  clientId: process.env.CLIENT_ID!,
  tokenUse: 'access',
  userPoolId: process.env.USER_POOL_ID!,
});

export const handler = async (
  event: APIGatewayProxyEvent & APIGatewayAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const accessToken = validateCookies(event.headers.Cookie);

    await verifier.verify(accessToken, {
      clientId: process.env.CLIENT_ID!,
      tokenUse: 'access',
    });
    const policy = generatePolicy({
      effect: 'Allow',
      principalId: 'user',
      resource: event.methodArn,
    });
    return policy;
  } catch (e) {
    console.error(e);
    return generatePolicy({
      effect: 'Deny',
      principalId: 'user',
      resource: '*',
    });
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

type GeneratePolicyParams = {
  effect: StatementEffect;
  principalId: string;
  resource: string;
};
function generatePolicy({
  effect,
  principalId,
  resource,
}: GeneratePolicyParams): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: effect === 'Allow' ? resource : '*',
        },
      ],
    },
  };
}
