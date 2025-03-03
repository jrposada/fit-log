import {
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent } from 'aws-lambda';
import dotenv from 'dotenv';
import assert from 'node:assert';
import { apiHandler } from '../../api-utils';

if (process.env.IS_OFFLINE) {
  const env = dotenv.config({ path: '.env.development' }).parsed;
  Object.assign(process.env, env);
}

assert(process.env.AWS_REGION);
const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const handler = apiHandler(async (event) => {
  const { email, password } = validateEvent(event);

  if (process.env.MOCK === 'true') {
    return {
      statusCode: 200,
      body: { success: true, data: undefined },
      multiValueHeaders: {
        'Set-Cookie': [
          'accessToken=mocked; Secure; HttpOnly; SameSite=Strict; Path=/',
          'refreshToken=mocked; Secure; HttpOnly; SameSite=Strict; Path=/',
        ],
      },
    };
  }

  const { CLIENT_ID, USER_POOL_ID } = process.env;
  assert(CLIENT_ID);
  assert(USER_POOL_ID);

  const response = await cognito.send(
    new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: CLIENT_ID,
      UserPoolId: USER_POOL_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    })
  );

  if (!response.AuthenticationResult?.IdToken) {
    throw Error('Server Error');
  }

  return {
    statusCode: 200,
    body: { success: true, data: undefined },
    multiValueHeaders: {
      'Set-Cookie': [
        `accessToken=${response.AuthenticationResult.AccessToken}; Secure; HttpOnly; SameSite=Strict; Path=/`,
        `refreshToken=${response.AuthenticationResult.RefreshToken}; Secure; HttpOnly; SameSite=Strict; Path=/`,
      ],
    },
  };
});

function validateEvent(event: APIGatewayProxyEvent): {
  email: string;
  password: string;
} {
  if (!event.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = JSON.parse(event.body);

    if (!body.email || !body.password) {
      throw new Error('Invalid request');
    }

    return {
      email: body.email,
      password: body.password,
    };
  } catch {
    throw new Error('Invalid request');
  }
}
