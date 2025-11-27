import {
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';
import dotenv from 'dotenv';
import { apiHandler } from '../api-utils';

if (process.env.IS_OFFLINE) {
  const env = dotenv.config({ path: '.env' }).parsed;
  Object.assign(process.env, env);
}

assert(process.env.AWS_REGION);
const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const handler = apiHandler(async ({ req }) => {
  const { email, password } = validateEvent(req);

  if (process.env.IS_OFFLINE) {
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

function validateEvent(req: Request): {
  email: string;
  password: string;
} {
  if (!req.body) {
    throw new Error('Invalid request');
  }

  try {
    const body = req.body;

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
