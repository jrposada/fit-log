import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { beautifyDate } from '@jrposada/fit-log-shared-react/beautifiers/date';

export function useStartTrainingSession() {
  const { mutate: startTrainingSession, isPending } = useTrainingSessionsPut();

  const handleStart = (locationId: string | null = null) => {
    const now = new Date();

    startTrainingSession({
      title: beautifyDate(now, 'YYYY MM DD'),
      startedAt: now.toUTCString(),
      location: locationId,
      climbHistories: [],
    });
  };

  return { handleStart, isPending };
}
