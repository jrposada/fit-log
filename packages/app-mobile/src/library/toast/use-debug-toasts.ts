import { useEffect } from 'react';

import { useToast } from './use-toast';

function useDebugToasts() {
  const toast = useToast();

  useEffect(() => {
    toast.show('Success toast message', 'success');
    toast.show('Destructive toast message', 'destructive');
    toast.show('Another success toast', 'success');
    toast.show('Another destructive toast', 'destructive');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export { useDebugToasts };
