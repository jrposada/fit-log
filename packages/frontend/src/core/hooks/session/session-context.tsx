import { createContext, Dispatch, SetStateAction } from 'react';

export type Session = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

export const SessionContext = createContext<Session | null>(null);
