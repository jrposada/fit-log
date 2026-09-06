import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';

import { ActiveTrainingSession } from './active-training-session';

export function useSetCurrentClimb(session: ActiveTrainingSession) {
  const setCurrentClimb = useTrainingSessionsPut();

  const handleSetCurrentClimb = (climbId: string) => {
    setCurrentClimb.mutate({
      id: session.id,
      sport: 'climbing',
      title: session.title,
      notes: session.notes,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      lastActivityAt: session.lastActivityAt,
      currentClimbId: climbId,
      location: session.location?.id ?? null,
      climbHistories: session.climbHistories.map((history) => history.id),
    });
  };

  return { handleSetCurrentClimb, isPending: setCurrentClimb.isPending };
}
