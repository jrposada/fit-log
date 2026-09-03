import { createContext } from 'react';

const TabBarOverlayHeightContext = createContext(0);
const TabBarOverlayHeightSetterContext = createContext<
  (height: number) => void
>(() => {});

export { TabBarOverlayHeightContext, TabBarOverlayHeightSetterContext };
