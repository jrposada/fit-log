import { useContext } from 'react';
import { Session, SessionContext } from './session-context';

export function useSession(): Session {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error(
      'You can not use `useSession` outside of <SessionProvider />.'
    );
  }

  return context;
}
