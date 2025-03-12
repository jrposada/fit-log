import { assert } from '@shared/utils/assert';
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

assert(process.env.CLIENT_ID, { msg: 'CLIENT_ID must be defined' });
assert(process.env.USER_POOL_ID, { msg: 'USER_POOL_ID must be defined' });

const verifier = CognitoJwtVerifier.create({
  clientId: process.env.CLIENT_ID,
  tokenUse: 'access',
  userPoolId: process.env.USER_POOL_ID,
});

export const handler = async (
  event: APIGatewayProxyEvent & APIGatewayAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  if (process.env.IS_OFFLINE) {
    console.info('Running in OFFLINE mode. AUTHORIZATION IS DISABLED!');

    return generateAllowPolicy({
      resource: event.methodArn,
      principalId: 'offline-user',
      context: {
        userId: 'offline-user',
        username: 'offline',
      },
    });
  }

  try {
    const accessToken = getAccessTokenFromCookies(event.headers.Cookie);

    const tokenPayload = await verifier.verify(accessToken);

    return generateAllowPolicy({
      resource: event.methodArn,
      principalId: tokenPayload.sub,
      context: {
        userId: tokenPayload.sub,
        username: tokenPayload.username,
      },
    });
  } catch (e) {
    console.error('Authorization error:', e);
    return generateDisallowPolicy();
  }
};

/**
 * Extracts the access token from the provided cookie string.
 * @param cookies String with all cookies separated by `;`.
 * @returns Access Token.
 */
function getAccessTokenFromCookies(cookies: string | undefined): string {
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

/**
 * Generates an allow policy including the provided context.
 */
function generateAllowPolicy({
  resource,
  principalId,
  context,
}: Omit<GeneratePolicyParams, 'effect'>): APIGatewayAuthorizerResult {
  return generatePolicy({
    effect: 'Allow',
    principalId,
    resource,
    context,
  });
}

/**
 * Generates a deny policy.
 */
function generateDisallowPolicy(): APIGatewayAuthorizerResult {
  return generatePolicy({
    effect: 'Deny',
    principalId: 'unauthorized',
    resource: '*',
  });
}

export type AuthorizerContext = {
  userId: string;
  username: string;
};

type GeneratePolicyParams = {
  effect: StatementEffect;
  principalId: string;
  resource: string;
  context?: AuthorizerContext;
};

/**
 * Generates a policy document with an optional context.
 */
function generatePolicy({
  effect,
  principalId,
  resource,
  context,
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
    context,
  };
}
