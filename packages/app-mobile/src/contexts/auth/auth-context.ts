import { createContext } from 'react';

import { UserInfo } from '../../services/auth-service';

type AuthContextValue = {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  loginWithIdp: (idp: 'google' | 'apple') => Promise<void>;
  register: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default AuthContext;
export type { AuthContextValue };
