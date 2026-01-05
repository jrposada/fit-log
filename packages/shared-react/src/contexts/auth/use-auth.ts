import { useContext } from 'react';

import AuthContext, { AuthContextValue } from './auth-context';

function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { useAuth };
