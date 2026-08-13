import { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { useTrainingSessionsActive } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-active';
import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SPORT_ICONS } from '../../features/feed/sport-icons';
import { Badge } from '../../library/badge';
import Button from '../../library/button';
import Card from '../../library/card';
import { Icon } from '../../library/icon';
import Stack from '../../library/stack';
import { accent, shadows, spacing } from '../../library/theme';
import { useToast } from '../../library/toast';
import { Typography } from '../../library/typography';
import SportPickerModal from '../sport-picker-modal';
import { styles } from './session-flyover.styles';

function formatDuration(startedAt: string): string {
  const totalSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  );
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

interface ActiveFlyoverProps {
  session: TrainingSession;
}

const ActiveFlyover: FunctionComponent<ActiveFlyoverProps> = ({ session }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [isExpanded, setExpanded] = useState(false);
  // Ticks the clock forward each second so the duration stays live.
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((tick) => tick + 1), 1000);
    return () => clearInterval(interval);
  }, []);

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
            setExpanded(false);
          },
        },
      ]
    );
  };

  return (
    <Card
      variant="elevatedStrong"
      highlight={accent.primary}
      onPress={() => setExpanded((expanded) => !expanded)}
    >
      <Stack gap="md">
        <Stack direction="horizontal" align="center" justify="between">
          <Stack direction="horizontal" align="center" gap="sm">
            <Icon
              icon={SPORT_ICONS.climbing}
              size="md"
              color={accent.primary}
            />
            <Badge
              label={t('climbing.session_active_badge')}
              variant="success"
            />
          </Stack>
          <Stack direction="horizontal" align="center" gap="xs">
            <Typography size="title" weight="bold" color="accent">
              {formatDuration(session.startedAt)}
            </Typography>
            <Icon
              icon={isExpanded ? '⌃' : '⌄'}
              size="sm"
              color={accent.primary}
            />
          </Stack>
        </Stack>

        {isExpanded && (
          <Stack gap="md">
            <Stack gap="2xs">
              <Typography
                size="overline"
                color="secondary"
                style={{ textTransform: 'uppercase' }}
              >
                {t('climbing.session_progress_label')}
              </Typography>
              <Typography size="heading" weight="bold">
                {t('climbing.climbs_count', {
                  count: session.climbHistories.length,
                })}
              </Typography>
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
        )}
      </Stack>
    </Card>
  );
};

const SessionFlyover: FunctionComponent = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isPickerVisible, setPickerVisible] = useState(false);

  const { data: activeSession } = useTrainingSessionsActive();

  const containerStyle = [
    styles.container,
    { bottom: insets.bottom + spacing['3xl'] },
  ];

  if (!activeSession) {
    return (
      <>
        <View style={containerStyle}>
          <Button
            title={t('nav.start_session')}
            icon="+"
            variant="primary"
            onPress={() => setPickerVisible(true)}
            style={[shadows.cardElevated, styles.startButton]}
          />
        </View>
        <SportPickerModal
          visible={isPickerVisible}
          onClose={() => setPickerVisible(false)}
        />
      </>
    );
  }

  return (
    <View style={containerStyle}>
      <ActiveFlyover session={activeSession} />
    </View>
  );
};

export default SessionFlyover;
