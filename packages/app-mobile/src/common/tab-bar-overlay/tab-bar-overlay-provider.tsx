import { FunctionComponent, PropsWithChildren, useState } from 'react';

import {
  TabBarOverlayHeightContext,
  TabBarOverlayHeightSetterContext,
} from './tab-bar-overlay-context';

/**
 * Tracks how much space the floating bottom tab bar + active-training-session
 * flyover occupy above the screen's bottom edge, so screens can keep content
 * (e.g. map provider badges, floating cards) clear of that overlay instead of
 * guessing its height with a magic number.
 */
const TabBarOverlayProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [height, setHeight] = useState(0);

  return (
    <TabBarOverlayHeightSetterContext.Provider value={setHeight}>
      <TabBarOverlayHeightContext.Provider value={height}>
        {children}
      </TabBarOverlayHeightContext.Provider>
    </TabBarOverlayHeightSetterContext.Provider>
  );
};

export default TabBarOverlayProvider;
