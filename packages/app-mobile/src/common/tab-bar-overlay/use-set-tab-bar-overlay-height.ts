import { useContext } from 'react';

import { TabBarOverlayHeightSetterContext } from './tab-bar-overlay-context';

/** For BottomTabBar only: reports its measured overlay height up. */
function useSetTabBarOverlayHeight(): (height: number) => void {
  return useContext(TabBarOverlayHeightSetterContext);
}

export { useSetTabBarOverlayHeight };
