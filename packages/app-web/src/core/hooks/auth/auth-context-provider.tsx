import { FunctionComponent, PropsWithChildren, useMemo, useState } from 'react';

import { Auth, AuthContext } from './auth-context';

const AuthProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const auth = useMemo<Auth>(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
