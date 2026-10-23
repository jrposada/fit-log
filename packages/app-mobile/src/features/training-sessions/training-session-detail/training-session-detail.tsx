import { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Badge } from '../../../library/badge';
import Button from '../../../library/button';
import { Icon } from '../../../library/icon';
import IconButton from '../../../library/icon-button';
import Stack from '../../../library/stack';
import { accent, ink } from '../../../library/theme';
import { Typography } from '../../../library/typography';
import { SPORT_ICONS } from '../../feed/sport-icons';
import PlannedItemsLog from '../../training-plans/planned-items-log';
import { styles } from './training-session-detail.styles';

interface TrainingSessionDetailProps {
  session: TrainingSession;
  isActive?: boolean;
  isExpanded: boolean;
  onToggleIsExpanded: () => void;
}

const TrainingSessionDetail: FunctionComponent<TrainingSessionDetailProps> = ({
  session,
  isActive,
  isExpanded,
  onToggleIsExpanded,
}) => {
  const { t } = useTranslation();

  const trainingSessionsPut = useTrainingSessionsPut();

  const handleLogFlash = () => {};
  const handleLogSend = () => {};
  const handleLogTry = () => {};
  const handleStopTrainingSession = () => {
    trainingSessionsPut.stop(session);
  };

  return (
    <Stack gap="md">
      {/* Header */}
      <Pressable onPress={onToggleIsExpanded}>
        <Stack direction="horizontal" align="center" justify="between">
          {/* Left */}
          <Stack direction="vertical" gap="0">
            <Stack direction="horizontal" align="center" gap="sm">
              <Icon
                icon={SPORT_ICONS[session.sport]}
                size="md"
                color={accent.primary}
              />
              {isActive && (
                <Badge
                  label={t('climbing.session_active_badge')}
                  variant="success"
                />
              )}
            </Stack>

            <Typography size="title" weight="bold">
              {session.title}
            </Typography>

            {session.sport === 'climbing' && (
              <Stack direction="horizontal" align="center">
                <Icon icon="location-pin" size="xs" color={ink.tertiary} />
                <Typography size="callout" color="tertiary">
                  {session.location?.name ?? t('common.unknown')}
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* Right */}
          <Stack direction="vertical" align="end" gap="0">
            <Button
              title={t('climbing.session_stop_button')}
              variant="destructive"
              icon="stop"
              fullWidth
              onPress={handleStopTrainingSession}
              disabled={trainingSessionsPut.isPending}
            />
            {session.currentClimb?.name && (
              <>
                <Typography>{session.currentClimb.name}</Typography>
                <Stack direction="horizontal" align="center" gap="xs">
                  <IconButton
                    icon="bolt"
                    variant="accent"
                    size="sm"
                    onPress={handleLogFlash}
                  />
                  <IconButton
                    icon="check"
                    variant="primary"
                    size="sm"
                    onPress={handleLogSend}
                  />
                  <IconButton
                    icon="replay"
                    variant="default"
                    size="sm"
                    onPress={handleLogTry}
                  />
                  <Icon
                    icon={isExpanded ? 'expand-less' : 'expand-more'}
                    size="sm"
                    color={accent.primary}
                  />
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </Pressable>

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        >
          <Stack gap="md">
            {session.planned && (
              <ScrollView
                style={styles.plannedItems}
                keyboardShouldPersistTaps="handled"
              >
                <PlannedItemsLog
                  key={session.id}
                  session={{ ...session, planned: session.planned }}
                />
              </ScrollView>
            )}
            <Stack direction="horizontal" justify="between">
              <Stack gap="2xs">
                <Typography
                  size="overline"
                  color="secondary"
                  style={{ textTransform: 'uppercase' }}
                >
                  {t('climbing.session_duration_label')}
                </Typography>
                <Typography size="heading" weight="bold">
                  {t('climbing.session_duration_unit')}
                </Typography>
              </Stack>
              {session.sport === 'climbing' && (
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
              )}
            </Stack>
          </Stack>
        </Animated.View>
      )}
    </Stack>
  );
};

export default TrainingSessionDetail;
