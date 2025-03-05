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

export const SessionContext = createContext<Session | null>(null);

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
