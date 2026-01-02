import { Settings } from '../register';

type CommandOptions = {
  username: string;
  password: string;
};

type CommandSettings = Settings<void, CommandOptions>;

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
};

async function fetchToken(
  username: string,
  password: string
): Promise<TokenResponse> {
  const keycloakEndpoint = process.env.KEYCLOAK_ENDPOINT;
  const keycloakRealm = process.env.KEYCLOAK_REALM;
  const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID;

  if (!keycloakEndpoint) {
    throw new Error('KEYCLOAK_ENDPOINT environment variable is not set');
  }
  if (!keycloakRealm) {
    throw new Error('KEYCLOAK_REALM environment variable is not set');
  }
  if (!keycloakClientId) {
    throw new Error('KEYCLOAK_CLIENT_ID environment variable is not set');
  }

  const tokenUrl = `${keycloakEndpoint}/realms/${keycloakRealm}/protocol/openid-connect/token`;

  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: keycloakClientId,
    username,
    password,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch token: ${response.status} - ${errorText}`);
  }

  return response.json() as Promise<TokenResponse>;
}

const action: CommandSettings['action'] = async (options) => {
  console.log(`Fetching token for user: ${options.username}`);

  const tokenResponse = await fetchToken(options.username, options.password);

  console.log('\n✓ Token fetched successfully!\n');
  console.log(`Token type: ${tokenResponse.token_type}`);
  console.log(`Expires in: ${tokenResponse.expires_in}s`);
  console.log(`Scope: ${tokenResponse.scope}`);
  console.log('\n--- Access Token ---\n');
  console.log(tokenResponse.access_token);
  console.log('\n--- Bearer Header ---\n');
  console.log(`Bearer ${tokenResponse.access_token}`);
};

const tokenCommand: CommandSettings = {
  name: 'token',
  description: 'Get a bearer token from Keycloak',
  action,
  options: [
    {
      flags: '-u, --username <username>',
      description: 'Keycloak username',
      type: 'string',
      defaultValue: 'testuser@example.com',
    },
    {
      flags: '-p, --password <password>',
      description: 'Keycloak password',
      type: 'string',
      defaultValue: 'password123',
    },
  ],
};

export default tokenCommand;
