import { FunctionComponent, ReactNode } from 'react';

import { FormReadonlyContext } from './use-form-readonly';

interface FormReadonlyProviderProps {
  readonly: boolean;
  children: ReactNode;
}

const FormReadonlyProvider: FunctionComponent<FormReadonlyProviderProps> = ({
  readonly,
  children,
}) => (
  <FormReadonlyContext.Provider value={readonly}>
    {children}
  </FormReadonlyContext.Provider>
);

export { FormReadonlyProvider };
