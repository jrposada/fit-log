import { SESSION_STALE_MS } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { useTrainingSessions } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions';
import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Resolves the climbing session a new climb-history write should attach to:
 * the most recent still-active session if one exists and hasn't gone stale,
 * otherwise a freshly created one. Lazy — nothing is created until a caller
 * actually logs a climb.
 */
function useActiveClimbingSession() {
  const { t } = useTranslation();
  const { items } = useTrainingSessions({ active: true, limit: 1 });
  const trainingSessionsPut = useTrainingSessionsPut();

  const existing = items[0];
  // Staleness is a wall-clock comparison by nature — there's no `isActive`
  // flag from the server, only `endedAt` presence, so "still active" has to
  // be re-derived against the current time on every render.
  // eslint-disable-next-line react-hooks/purity -- Date.now() is deliberate here, see comment above.
  const now = Date.now();
  const isStale =
    !!existing &&
    now - new Date(existing.lastActivityAt ?? existing.startedAt).getTime() >
      SESSION_STALE_MS;

  const activeSession = existing && !isStale ? existing : undefined;

  const ensureActiveClimbingSession = useCallback(async (): Promise<string> => {
    if (activeSession) {
      return activeSession.id;
    }

    const created = await trainingSessionsPut.mutateAsync({
      title: t('climbing.default_session_title'),
      startedAt: new Date().toISOString(),
      location: null,
      climbHistories: [],
    });
    return created.id;
  }, [activeSession, trainingSessionsPut, t]);

  return {
    activeSession,
    activeClimbingSessionId: activeSession?.id,
    ensureActiveClimbingSession,
  };
}

export { useActiveClimbingSession };
