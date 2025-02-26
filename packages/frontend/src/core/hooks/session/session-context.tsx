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

export const defaultSession: Session = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
};

// Context
export const SessionContext = createContext<Session | null>(null);

// Context Provider
export type SessionProviderProps = {};
export const SessionProvider: FunctionComponent<
  PropsWithChildren<SessionProviderProps>
> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
