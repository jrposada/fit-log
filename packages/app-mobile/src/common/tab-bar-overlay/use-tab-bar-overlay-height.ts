import { useContext } from 'react';

import { TabBarOverlayHeightContext } from './tab-bar-overlay-context';

/** Height, in points, currently covered by the floating tab bar overlay. */
function useTabBarOverlayHeight(): number {
  return useContext(TabBarOverlayHeightContext);
}

export { useTabBarOverlayHeight };
