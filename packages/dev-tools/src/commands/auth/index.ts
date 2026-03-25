import type { Command } from 'commander';

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
    throw new Error(
      `Failed to fetch token: ${response.status} - ${errorText}`
    );
  }

  return response.json() as Promise<TokenResponse>;
}

export default function registerAuthCommand(program: Command): void {
  const authCmd = program
    .command('auth')
    .description('Authentication commands');

  authCmd
    .command('token')
    .description('Get a bearer token from Keycloak')
    .option(
      '-u, --username <username>',
      'Keycloak username',
      'testuser@example.com'
    )
    .option('-p, --password <password>', 'Keycloak password', 'password123')
    .action(async (options: { username: string; password: string }) => {
      console.log(`Fetching token for user: ${options.username}`);

      const tokenResponse = await fetchToken(
        options.username,
        options.password
      );

      console.log('\n✓ Token fetched successfully!\n');
      console.log(`Token type: ${tokenResponse.token_type}`);
      console.log(`Expires in: ${tokenResponse.expires_in}s`);
      console.log(`Scope: ${tokenResponse.scope}`);
      console.log('\n--- Access Token ---\n');
      console.log(tokenResponse.access_token);
      console.log('\n--- Bearer Header ---\n');
      console.log(`Bearer ${tokenResponse.access_token}`);

      process.exit(0);
    });

  authCmd.action(() => {
    console.log();
    console.log('Available auth commands:');
    console.log();
    console.log('  dev-tools auth token    Get a bearer token from Keycloak');
    console.log();
  });
}
