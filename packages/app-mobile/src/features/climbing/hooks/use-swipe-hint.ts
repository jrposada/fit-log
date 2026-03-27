import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'climb_card_swipe_hint_shown';

/**
 * Returns whether the swipe hint peek animation should be shown.
 * After the first display, persists a flag so it never shows again.
 */
export function useSwipeHint() {
  const [shouldPeek, setShouldPeek] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value !== 'true') {
        setShouldPeek(true);
      }
    });
  }, []);

  const markShown = useCallback(() => {
    setShouldPeek(false);
    AsyncStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  return { shouldPeek, markShown };
}
