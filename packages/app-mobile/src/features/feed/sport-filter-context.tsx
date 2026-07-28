import { Sport } from '@jrposada/fit-log-shared/common/sports/sports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';

type SportFilter = 'all' | Sport;

const STORAGE_KEY = 'feed_sport_filter';

type SportFilterContextValue = {
  sportFilter: SportFilter;
  setSportFilter: (filter: SportFilter) => void;
};

const SportFilterContext = createContext<SportFilterContextValue | null>(null);

/**
 * The History and Stats tabs share one sport filter, persisted across app
 * launches — a user who climbs mostly wants Climbing pre-selected everywhere,
 * not reset per screen.
 */
const SportFilterProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [sportFilter, setSportFilterState] = useState<SportFilter>('all');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        setSportFilterState(value as SportFilter);
      }
    });
  }, []);

  const setSportFilter = (filter: SportFilter) => {
    setSportFilterState(filter);
    AsyncStorage.setItem(STORAGE_KEY, filter);
  };

  return (
    <SportFilterContext.Provider value={{ sportFilter, setSportFilter }}>
      {children}
    </SportFilterContext.Provider>
  );
};

export { SportFilterContext, SportFilterProvider };
export type { SportFilter, SportFilterContextValue };
