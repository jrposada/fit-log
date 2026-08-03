import { SESSION_STALE_MS } from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-session';
import { useClimbingSessions } from '@jrposada/fit-log-shared-react/api/climbing-sessions/use-climbing-sessions';
import { useClimbingSessionsPut } from '@jrposada/fit-log-shared-react/api/climbing-sessions/use-climbing-sessions-put';
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
  const { items } = useClimbingSessions({ active: true, limit: 1 });
  const climbingSessionsPut = useClimbingSessionsPut();

  const ensureActiveClimbingSession = useCallback(async (): Promise<string> => {
    const existing = items[0];
    const isStale =
      !!existing &&
      Date.now() -
        new Date(existing.lastActivityAt ?? existing.startedAt).getTime() >
        SESSION_STALE_MS;

    if (existing && !isStale) {
      return existing.id;
    }

    const created = await climbingSessionsPut.mutateAsync({
      title: t('climbing.default_session_title'),
      startedAt: new Date().toISOString(),
      location: null,
      climbHistories: [],
    });
    return created.id;
  }, [items, climbingSessionsPut, t]);

  return {
    activeClimbingSessionId: items[0]?.id,
    ensureActiveClimbingSession,
  };
}

export { useActiveClimbingSession };
