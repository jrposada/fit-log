import { useContext } from 'react';

import { SportFilterContext } from './sport-filter-context';

function useSportFilter() {
  const context = useContext(SportFilterContext);
  if (!context) {
    throw new Error('useSportFilter must be used within a SportFilterProvider');
  }
  return context;
}

export { useSportFilter };
