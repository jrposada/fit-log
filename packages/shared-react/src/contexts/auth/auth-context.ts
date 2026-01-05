import { createContext } from 'react';

type UserInfo = {
  sub: string;
  email: string;
  name: string;
};

type AuthContextValue = {
  user: UserInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: () => Promise<void>;
  loginWithIdp: (idp: 'google' | 'apple') => Promise<void>;
  register: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default AuthContext;
export type { AuthContextValue, UserInfo };
