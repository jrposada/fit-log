import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { apiHandler } from '../../api-utils';

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const handler = apiHandler(async (event) => {
  const { email, password } = validateEvent(event);
  const { USER_POOL_ID } = process.env;

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
