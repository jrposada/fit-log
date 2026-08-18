import { ClimbGrade } from '@jrposada/fit-log-shared/common/climbs/grades';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type ExploreFilters = {
  search: string;
  grade: ClimbGrade[];
  locationId: string;
  ownerId: string;
};

const STORAGE_KEY = 'explore_filters';
const DEFAULT_FILTERS: ExploreFilters = {
  search: '',
  grade: [],
  locationId: '',
  ownerId: '',
};

/**
 * Explore's filters persist across app launches, mirroring the sport filter
 * in sport-filter-context.tsx — a user mid-search for a grade/location wants
 * that preserved, not reset every time the tab is opened.
 */
function useExploreFilters() {
  const [initialValues, setInitialValues] = useState<ExploreFilters | null>(
    null
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      setInitialValues(
        raw ? { ...DEFAULT_FILTERS, ...JSON.parse(raw) } : DEFAULT_FILTERS
      );
    });
  }, []);

  const persist = useCallback((values: ExploreFilters) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, []);

  return { initialValues, persist };
}

export { useExploreFilters };
