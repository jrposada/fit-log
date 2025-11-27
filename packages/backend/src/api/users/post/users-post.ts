import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { assert } from '@shared/utils/assert';
import { Request } from 'express';
import { apiHandler } from '../../api-utils';

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const handler = apiHandler(async ({ req }) => {
  const { email, password } = validateEvent(req);
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
