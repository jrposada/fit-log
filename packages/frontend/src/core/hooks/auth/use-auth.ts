import { useContext } from 'react';
import { Auth, AuthContext } from './auth-context';

export function useAuth(): Auth {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('You can not use `useAuth` outside of <AuthProvider />.');
  }

  return context;
}
