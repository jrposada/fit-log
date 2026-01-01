import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const KEYCLOAK_URL = process.env.EXPO_PUBLIC_KEYCLOAK_URL;
const KEYCLOAK_REALM = process.env.EXPO_PUBLIC_KEYCLOAK_REALM;
const KEYCLOAK_CLIENT_ID = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID;

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const ID_TOKEN_KEY = 'auth_id_token';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  expiresIn?: number;
};

export type UserInfo = {
  sub: string;
  email?: string;
  name?: string;
  preferredUsername?: string;
  emailVerified?: boolean;
};

const getDiscoveryDocument = (): AuthSession.DiscoveryDocument => {
  const baseUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`;
  return {
    authorizationEndpoint: `${baseUrl}/protocol/openid-connect/auth`,
    tokenEndpoint: `${baseUrl}/protocol/openid-connect/token`,
    revocationEndpoint: `${baseUrl}/protocol/openid-connect/revoke`,
    userInfoEndpoint: `${baseUrl}/protocol/openid-connect/userinfo`,
    endSessionEndpoint: `${baseUrl}/protocol/openid-connect/logout`,
  };
};

export const getRedirectUri = (): string => {
  const uri = AuthSession.makeRedirectUri({
    scheme: 'fitlog',
    path: 'auth/callback',
  });

  console.log('[Auth] Redirect URI:', uri);
  return uri;
};

export const authService = {
  getDiscoveryDocument,

  async saveTokens(tokens: AuthTokens): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
      tokens.idToken
        ? SecureStore.setItemAsync(ID_TOKEN_KEY, tokens.idToken)
        : Promise.resolve(),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async getIdToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ID_TOKEN_KEY);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(ID_TOKEN_KEY),
    ]);
  },

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const discovery = getDiscoveryDocument();

    const response = await fetch(discovery.tokenEndpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: KEYCLOAK_CLIENT_ID!,
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      expiresIn: data.expires_in,
    };
  },

  async fetchUserInfo(accessToken: string): Promise<UserInfo> {
    const discovery = getDiscoveryDocument();

    const response = await fetch(discovery.userInfoEndpoint!, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();

    return {
      sub: data.sub,
      email: data.email,
      name: data.name,
      preferredUsername: data.preferred_username,
      emailVerified: data.email_verified,
    };
  },

  async logout(idToken: string): Promise<void> {
    const discovery = getDiscoveryDocument();
    const redirectUri = getRedirectUri();

    await WebBrowser.openAuthSessionAsync(
      `${discovery.endSessionEndpoint}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`,
      redirectUri
    );

    await this.clearTokens();
  },

  getAuthRequest(): AuthSession.AuthRequest {
    const discovery = getDiscoveryDocument();
    const redirectUri = getRedirectUri();

    return new AuthSession.AuthRequest({
      clientId: KEYCLOAK_CLIENT_ID!,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      usePKCE: true,
      responseType: AuthSession.ResponseType.Code,
    });
  },

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<AuthTokens> {
    const discovery = getDiscoveryDocument();
    const redirectUri = getRedirectUri();

    const response = await fetch(discovery.tokenEndpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KEYCLOAK_CLIENT_ID!,
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Token exchange failed: ${errorData}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      expiresIn: data.expires_in,
    };
  },
};
