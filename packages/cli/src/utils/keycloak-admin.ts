import assert from 'node:assert';

interface KeycloakConfig {
  endpoint: string;
  realm: string;
  admin: string;
  adminPassword: string;
}

function readKeycloakConfig(): KeycloakConfig {
  const endpoint = process.env.KEYCLOAK_ENDPOINT;
  const realm = process.env.KEYCLOAK_REALM;
  const admin = process.env.KEYCLOAK_ADMIN;
  const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD;

  assert(endpoint, 'KEYCLOAK_ENDPOINT environment variable is not set');
  assert(realm, 'KEYCLOAK_REALM environment variable is not set');
  assert(admin, 'KEYCLOAK_ADMIN environment variable is not set');
  assert(
    adminPassword,
    'KEYCLOAK_ADMIN_PASSWORD environment variable is not set'
  );

  return { endpoint, realm, admin, adminPassword };
}

export async function getKeycloakAdminToken(): Promise<{
  token: string;
  config: KeycloakConfig;
}> {
  const config = readKeycloakConfig();

  const tokenUrl = `${config.endpoint}/realms/master/protocol/openid-connect/token`;
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: 'admin-cli',
    username: config.admin,
    password: config.adminPassword,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get Keycloak admin token: ${response.status} - ${errorText}`
    );
  }

  const { access_token } = (await response.json()) as { access_token: string };
  return { token: access_token, config };
}

export interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Look up a user in the configured realm by email. Returns null if no
 * user with that email exists.
 */
export async function findKeycloakUserByEmail(
  email: string
): Promise<KeycloakUser | null> {
  const { token, config } = await getKeycloakAdminToken();

  const url = `${config.endpoint}/admin/realms/${config.realm}/users?email=${encodeURIComponent(email)}&exact=true`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to query Keycloak users: ${response.status} - ${errorText}`
    );
  }

  const users = (await response.json()) as KeycloakUser[];
  return users[0] ?? null;
}
