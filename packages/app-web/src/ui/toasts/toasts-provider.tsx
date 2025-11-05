import { Alert, Collapse, Snackbar, Stack } from '@mui/material';
import {
  Fragment,
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuid } from 'uuid';

import { ToastInstance, Toasts, ToastsContext } from './toasts-context';

type ToastInstanceWithState = ToastInstance & {
  open: boolean;
};

const DEFAULT_DURATION = 5000;

const ToastsProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [toastInstances, setToastInstances] = useState<
    ToastInstanceWithState[]
  >([]);

  const push = useCallback<Toasts['push']>((instance) => {
    setToastInstances((prev) => [
      ...prev,
      { ...instance, id: uuid(), open: true },
    ]);
  }, []);

  const pop = useCallback<Toasts['pop']>(() => {
    setToastInstances((prev) => {
      const next = [...prev];
      next[next.length - 1].open = false;
      return next;
    });
  }, []);

  const close = useCallback((id: string) => {
    setToastInstances((prev) =>
      prev.map((item) => (item.id === id ? { ...item, open: false } : item))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setToastInstances((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toasts = useMemo<Toasts>(
    () => ({
      pop,
      push,
    }),
    [pop, push]
  );

  return (
    <ToastsContext.Provider value={toasts}>
      {children}
      {createPortal(
        <Stack
          alignItems="flex-end"
          position="absolute"
          sx={(theme) => ({
            position: 'fixed',
            top: theme.spacing(1),
            right: theme.spacing(1),
            zIndex: theme.zIndex.snackbar,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'flex-end',
            pointerEvents: 'none',
          })}
        >
          {toastInstances.map((instance) => (
            <Fragment key={instance.id}>
              <Collapse
                in={instance.open}
                timeout={{ enter: 200, exit: 250 }}
                unmountOnExit
                onExited={() => remove(instance.id)}
                sx={{ pointerEvents: 'auto' }}
              >
                <Snackbar
                  open={instance.open}
                  autoHideDuration={instance.duration ?? DEFAULT_DURATION}
                  sx={{ position: 'static', pointerEvents: 'auto' }}
                >
                  <Alert
                    onClose={() => close(instance.id)}
                    severity={instance.variant}
                    variant="filled"
                    sx={{ width: '100%' }}
                  >
                    {instance.message}
                  </Alert>
                </Snackbar>
              </Collapse>
            </Fragment>
          ))}
        </Stack>,
        document.body
      )}
    </ToastsContext.Provider>
  );
};

export default ToastsProvider;
