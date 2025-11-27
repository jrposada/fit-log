import {
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { assert } from '@shared/utils/assert';
import dotenv from 'dotenv';
import { toApiResponse } from '../api-utils';
import {
  UsersAuthorizeRequest,
  UsersAuthorizeResponse,
} from '@shared/models/users';

if (process.env.IS_OFFLINE) {
  const env = dotenv.config({ path: '.env' }).parsed;
  Object.assign(process.env, env);
}

assert(process.env.AWS_REGION);
const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});


const handler = toApiResponse<
  UsersAuthorizeResponse,
  unknown,
  unknown,
  UsersAuthorizeRequest
>(async (request) => {
  const { email, password } = request.body;

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

export { handler };
