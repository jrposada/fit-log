import { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { Badge } from '../../library/badge';
import Button from '../../library/button';
import Card from '../../library/card';
import { Icon } from '../../library/icon';
import Stack from '../../library/stack';
import { accent } from '../../library/theme';
import { useToast } from '../../library/toast';
import { Typography } from '../../library/typography';
import { SPORT_ICONS } from '../feed/sport-icons';

interface ActiveTrainingSessionCardProps {
  session: TrainingSession;
  onPress: () => void;
}

function formatDuration(startedAt: string): string {
  const totalSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  );
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

const ActiveTrainingSessionCard: FunctionComponent<
  ActiveTrainingSessionCardProps
> = ({ session, onPress }) => {
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
          },
        },
      ]
    );
  };

  return (
    <Card variant="elevatedStrong" highlight={accent.primary} onPress={onPress}>
      <Stack gap="md">
        <Stack direction="horizontal" align="center" justify="between">
          <Stack
            direction="horizontal"
            align="center"
            gap="sm"
            style={{ flex: 1 }}
          >
            <Icon
              icon={SPORT_ICONS.climbing}
              size="lg"
              color={accent.primary}
            />
            <Typography size="title" weight="semibold" color="accent">
              {session.title}
            </Typography>
          </Stack>
          <Badge label={t('climbing.session_active_badge')} variant="success" />
        </Stack>

        <Stack direction="horizontal" justify="between">
          <Stack gap="2xs">
            <Typography
              size="overline"
              color="secondary"
              style={{ textTransform: 'uppercase' }}
            >
              {t('climbing.session_progress_label')}
            </Typography>
            <Typography size="heading" weight="bold" color="accent">
              {t('climbing.climbs_count', {
                count: session.climbHistories.length,
              })}
            </Typography>
          </Stack>
          <Stack gap="2xs">
            <Typography
              size="overline"
              color="secondary"
              style={{ textTransform: 'uppercase' }}
            >
              {t('climbing.session_duration_label')}
            </Typography>
            <Typography size="heading" weight="bold" color="accent">
              {formatDuration(session.startedAt)}{' '}
              <Typography size="caption" color="secondary">
                {t('climbing.session_duration_unit')}
              </Typography>
            </Typography>
          </Stack>
        </Stack>

        <Button
          title={t('climbing.session_stop_button')}
          variant="destructive"
          icon="⏹️"
          fullWidth
          onPress={handleStop}
          disabled={stopSession.isPending}
        />
      </Stack>
    </Card>
  );
};

export default ActiveTrainingSessionCard;
