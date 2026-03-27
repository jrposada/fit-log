import AuthContext, {
  AuthContextValue,
} from '@shared-react/contexts/auth/auth-context';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { authService, getRedirectUri, UserInfo } from './auth-service';

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, _setToken] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = useCallback((newToken: string | null) => {
    tokenRef.current = newToken;
    _setToken(newToken);
  }, []);

  const getToken = useCallback(() => tokenRef.current, []);

  const discovery = authService.getDiscoveryDocument();
  const redirectUri = getRedirectUri();

  const [authRequest, authResponse, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID!,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      usePKCE: true,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  const authCode =
    authResponse?.type === 'success' ? authResponse.params.code : undefined;

  // Handle auth response
  useEffect(() => {
    const handleAuthResponse = async () => {
      if (authCode && authRequest?.codeVerifier) {
        try {
          const tokens = await authService.exchangeCodeForTokens(
            authCode,
            authRequest.codeVerifier
          );
          await authService.saveTokens(tokens);
          setToken(tokens.accessToken);
          const userInfo = await authService.fetchUserInfo(tokens.accessToken);
          setUser(userInfo);
        } catch (error) {
          console.error('Auth response handling failed:', error);
        }
      }
    };

    handleAuthResponse();
  }, [authRequest?.codeVerifier, authCode, setToken]);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshToken = await authService.getRefreshToken();
        if (refreshToken) {
          const tokens = await authService.refreshTokens(refreshToken);
          await authService.saveTokens(tokens);
          setToken(tokens.accessToken);
          const userInfo = await authService.fetchUserInfo(tokens.accessToken);
          setUser(userInfo);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        await authService.clearTokens();
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setToken]);

  const login = useCallback(async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, [promptAsync]);

  const loginWithIdp = useCallback(
    async (idp: 'google' | 'apple') => {
      try {
        // const keycloakUrl = process.env.EXPO_PUBLIC_KEYCLOAK_URL;
        // const realm = process.env.EXPO_PUBLIC_KEYCLOAK_REALM;
        const clientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID;

        // Create auth request with IDP hint
        const request = new AuthSession.AuthRequest({
          clientId: clientId!,
          redirectUri,
          scopes: ['openid', 'profile', 'email'],
          usePKCE: true,
          responseType: AuthSession.ResponseType.Code,
          extraParams: {
            kc_idp_hint: idp,
          },
        });

        await request.makeAuthUrlAsync(discovery);
        const result = await request.promptAsync(discovery);

        if (result.type === 'success' && request.codeVerifier) {
          const tokens = await authService.exchangeCodeForTokens(
            result.params.code,
            request.codeVerifier
          );
          await authService.saveTokens(tokens);
          setToken(tokens.accessToken);
          const userInfo = await authService.fetchUserInfo(tokens.accessToken);
          setUser(userInfo);
        }
      } catch (error) {
        console.error('IDP login failed:', error);
      }
    },
    [discovery, redirectUri, setToken]
  );

  const register = useCallback(async () => {
    try {
      const keycloakUrl = process.env.EXPO_PUBLIC_KEYCLOAK_URL;
      const realm = process.env.EXPO_PUBLIC_KEYCLOAK_REALM;
      const clientId = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID;

      // Open Keycloak registration page
      const registrationUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/registrations?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email`;

      const result = await WebBrowser.openAuthSessionAsync(
        registrationUrl,
        redirectUri
      );

      if (result.type === 'success') {
        // Extract code from URL
        const url = new URL(result.url);
        const code = url.searchParams.get('code');

        if (code && authRequest?.codeVerifier) {
          const tokens = await authService.exchangeCodeForTokens(
            code,
            authRequest.codeVerifier
          );
          await authService.saveTokens(tokens);
          setToken(tokens.accessToken);
          const userInfo = await authService.fetchUserInfo(tokens.accessToken);
          setUser(userInfo);
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }, [authRequest?.codeVerifier, redirectUri, setToken]);

  const refreshToken = useCallback(async () => {
    const storedRefreshToken = await authService.getRefreshToken();
    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    const tokens = await authService.refreshTokens(storedRefreshToken);
    await authService.saveTokens(tokens);
    setToken(tokens.accessToken);
    const userInfo = await authService.fetchUserInfo(tokens.accessToken);
    setUser(userInfo);
  }, [setToken]);

  const logout = useCallback(async () => {
    try {
      const idToken = await authService.getIdToken();
      if (idToken) {
        await authService.logout(idToken);
      } else {
        await authService.clearTokens();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      await authService.clearTokens();
    } finally {
      setUser(null);
      setToken(null);
    }
  }, [setToken]);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      token,
      getToken,
      login,
      loginWithIdp,
      register,
      refreshToken,
      logout,
    }),
    [
      getToken,
      isLoading,
      login,
      loginWithIdp,
      logout,
      refreshToken,
      register,
      token,
      user,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
