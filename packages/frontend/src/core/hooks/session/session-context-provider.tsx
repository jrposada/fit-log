import { FunctionComponent, PropsWithChildren, useMemo, useState } from 'react';
import { Session, SessionContext } from './session-context';

const SessionProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const session = useMemo<Session>(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
    }),
    [isAuthenticated]
  );

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
