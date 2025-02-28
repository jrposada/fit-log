import {
  createContext,
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

export type Session = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

// Context
export const SessionContext = createContext<Session | null>(null);

// Context Provider
export type SessionProviderProps = {};
export const SessionProvider: FunctionComponent<
  PropsWithChildren<SessionProviderProps>
> = ({ children }) => {
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
