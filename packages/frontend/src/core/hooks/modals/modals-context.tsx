import { createContext, ReactNode } from 'react';

export type Modals = {
  pop: () => void;
  push: (instance: Omit<ModalInstance, 'id'>) => void;
};

export type ModalInstance = {
  onClose?: (result: boolean) => void;
  node: ReactNode;
  id: string;
};

export const ModalsContext = createContext<Modals | null>(null);
