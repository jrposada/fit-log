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

import { ModalInstance, Modals, ModalsContext } from './modals-context';

const ModalsProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [modalInstances, setModalInstances] = useState<ModalInstance[]>([]);

  const pop = useCallback<Modals['pop']>(() => {
    const { onClose } = modalInstances[modalInstances.length - 1];

    onClose?.(false);

    setModalInstances((prev) => {
      const next = [...prev];
      void next.splice(-1);
      return next;
    });
  }, [modalInstances]);

  const push = useCallback<Modals['push']>((instance) => {
    setModalInstances((prev) => [...prev, { ...instance, id: uuid() }]);
  }, []);

  const modals = useMemo<Modals>(
    () => ({
      pop,
      push,
    }),
    [pop, push]
  );

  return (
    <ModalsContext.Provider value={modals}>
      {children}
      {createPortal(
        <>
          {modalInstances.map((instance) => (
            <Fragment key={instance.id}>{instance.node}</Fragment>
          ))}
        </>,
        document.body
      )}
    </ModalsContext.Provider>
  );
};

export default ModalsProvider;
