import { useContext } from 'react';

import { Toasts, ToastsContext } from './toasts-context';

export function useToasts(): Toasts {
  const context = useContext(ToastsContext);

  if (!context) {
    throw new Error(
      'You can not use `useToasts` outside of <ToastsProvider />.'
    );
  }

  return context;
}
