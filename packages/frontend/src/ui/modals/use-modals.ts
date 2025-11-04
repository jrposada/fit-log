import { useContext } from 'react';

import { Modals, ModalsContext } from './modals-context';

export function useModals(): Modals {
  const context = useContext(ModalsContext);

  if (!context) {
    throw new Error(
      'You can not use `useModals` outside of <ModalsProvider />.'
    );
  }

  return context;
}
