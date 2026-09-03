import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useToast } from '../../../library/toast';
import { ActiveTrainingSession } from './active-training-session';

export function useStopTrainingSession(
  session: ActiveTrainingSession,
  onStopped: () => void
) {
  const { t } = useTranslation();
  const toast = useToast();

  const stopSession = useTrainingSessionsPut({
    onError: (error) => {
      toast.show(t('climbing.session_stop_error', { error }), 'destructive');
    },
  });

  const handleStop = () => {
    Alert.alert(
      t('climbing.session_stop_confirm_title'),
      t('climbing.session_stop_confirm_message'),
      [
        { text: t('climbing.cancel'), style: 'cancel' },
        {
          text: t('climbing.session_stop_button'),
          style: 'destructive',
          onPress: () => {
            stopSession.mutate({
              id: session.id,
              sport: 'climbing',
              title: session.title,
              notes: session.notes,
              startedAt: session.startedAt,
              endedAt: new Date().toISOString(),
              lastActivityAt: session.lastActivityAt,
              location: session.location?.id ?? null,
              climbHistories: session.climbHistories.map(
                (history) => history.id
              ),
            });
            onStopped();
          },
        },
      ]
    );
  };

  return { handleStop, isPending: stopSession.isPending };
}
