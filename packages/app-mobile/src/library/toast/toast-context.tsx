import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';

type ToastVariant = 'success' | 'destructive';

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  show: (message: string, variant: ToastVariant) => void;
  visibleToasts: ToastItem[];
  dismiss: (id: number) => void;
};

const MAX_VISIBLE = 3;

const ToastContext = createContext<ToastContextValue | null>(null);

const ToastProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [visibleToasts, setVisibleToasts] = useState<ToastItem[]>([]);
  const queueRef = useRef<ToastItem[]>([]);
  const idRef = useRef(0);

  const promoteFromQueue = useCallback(() => {
    setVisibleToasts((prev) => {
      if (prev.length >= MAX_VISIBLE || queueRef.current.length === 0) {
        return prev;
      }

      const slotsAvailable = MAX_VISIBLE - prev.length;
      const promoted = queueRef.current.splice(0, slotsAvailable);
      return [...prev, ...promoted];
    });
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      setVisibleToasts((prev) => prev.filter((t) => t.id !== id));
      // Use setTimeout to promote after state update
      setTimeout(promoteFromQueue, 0);
    },
    [promoteFromQueue]
  );

  const show = useCallback((message: string, variant: ToastVariant) => {
    idRef.current += 1;
    const toast: ToastItem = { id: idRef.current, message, variant };

    setVisibleToasts((prev) => {
      if (prev.length >= MAX_VISIBLE) {
        queueRef.current.push(toast);
        return prev;
      }
      return [...prev, toast];
    });
  }, []);

  return (
    <ToastContext.Provider value={{ show, visibleToasts, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastProvider };
export type { ToastItem, ToastVariant };
