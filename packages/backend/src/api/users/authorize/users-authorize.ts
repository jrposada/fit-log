import { APIGatewayProxyEvent } from 'aws-lambda';
import { apiHandler } from '../../api-utils';
import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

export const handler = apiHandler(async (event) => {
  const { email, password } = validateEvent(event);
  const { CLIENT_ID, USER_POOL_ID } = process.env;

  const cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });
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
    body: { success: true, data: response.AuthenticationResult.IdToken },
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
