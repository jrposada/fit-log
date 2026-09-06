import { useClimbHistoriesPut } from '@jrposada/fit-log-shared-react/api/climb-histories/use-climb-histories-put';
import { useClimbsById } from '@jrposada/fit-log-shared-react/api/climbs/use-climbs-by-id';
import { useTranslation } from 'react-i18next';

import { useToast } from '../../../library/toast';
import { ActiveTrainingSession } from './active-training-session';

export function useCurrentClimbAttempts(session: ActiveTrainingSession) {
  const { t } = useTranslation();
  const toast = useToast();

  const currentHistory = session.currentClimbId
    ? session.climbHistories.find((h) => h.climb === session.currentClimbId)
    : undefined;
  const lastTry = currentHistory?.tries[currentHistory.tries.length - 1];
  const canStep = !!currentHistory && !!lastTry;

  const { data: climb } = useClimbsById({ id: session.currentClimbId });

  const climbHistoriesPut = useClimbHistoriesPut({
    onError: (error) =>
      toast.show(
        t('climbing.session_attempts_update_error', { error }),
        'destructive'
      ),
  });

  const handleChangeAttempts = (attempts: number) => {
    if (!currentHistory || !lastTry || attempts < 1) {
      return;
    }

    climbHistoriesPut.mutate({
      tryId: lastTry.id,
      climb: currentHistory.climb,
      location: currentHistory.location,
      sector: currentHistory.sector,
      status: lastTry.status,
      attempts,
      notes: lastTry.notes,
      date: lastTry.date,
      trainingSession: session.id,
    });
  };

  return {
    climb: canStep ? climb : undefined,
    attempts: lastTry?.attempts ?? 1,
    canStep,
    handleChangeAttempts,
    isPending: climbHistoriesPut.isPending,
  };
}
