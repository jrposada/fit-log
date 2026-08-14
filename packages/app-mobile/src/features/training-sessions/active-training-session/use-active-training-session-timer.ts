import { useEffect, useState } from 'react';

import { formatDuration } from './format-duration';

export function useActiveTrainingSessionTimer(startedAt: string): string {
  // Ticks the clock forward each second so the duration stays live.
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((tick) => tick + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return formatDuration(startedAt);
}
