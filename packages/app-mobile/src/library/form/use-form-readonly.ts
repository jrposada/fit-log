import { createContext, useContext } from 'react';

const FormReadonlyContext = createContext<boolean>(false);

function useFormReadonly(propOverride?: boolean): boolean {
  const contextValue = useContext(FormReadonlyContext);
  return propOverride ?? contextValue;
}

export { FormReadonlyContext, useFormReadonly };
