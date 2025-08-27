import { createContext, ReactNode } from 'react';

export type Toasts = {
  pop: () => void;
  push: (instance: Omit<ToastInstance, 'id'>) => void;
};

export type ToastInstance = {
  message: ReactNode;
  variant?: 'success' | 'error';
  id: string;
  duration?: number;
};

export const ToastsContext = createContext<Toasts | null>(null);
