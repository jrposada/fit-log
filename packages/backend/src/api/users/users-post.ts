import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { UsersPostRequest, UsersPostResponse } from '@shared/models/users';
import { assert } from '@shared/utils/assert';

import { toApiResponse } from '../api-utils';

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const handler = toApiResponse<
  UsersPostResponse,
  unknown,
  unknown,
  UsersPostRequest
>(async (request) => {
  const { email, password } = request.body;
  const { USER_POOL_ID } = process.env;
  assert(USER_POOL_ID);

  const response = await cognito.send(
    new AdminCreateUserCommand({
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
      ],
      Username: email,
      UserPoolId: USER_POOL_ID,
    })
  );

  if (!response.User) {
    throw new Error('Server Error');
  }

  await cognito.send(
    new AdminSetUserPasswordCommand({
      Password: password,
      Username: email,
      UserPoolId: USER_POOL_ID,
      Permanent: true,
    })
  );

  return {
    statusCode: 200,
    body: { success: true, data: undefined },
  };
});

export { handler };
