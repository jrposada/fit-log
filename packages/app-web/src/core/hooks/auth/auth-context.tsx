import { createContext, Dispatch, SetStateAction } from 'react';

export type Auth = {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<Auth | null>(null);
