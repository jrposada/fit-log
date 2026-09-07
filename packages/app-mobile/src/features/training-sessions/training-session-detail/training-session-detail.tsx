import { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Badge } from '../../../library/badge';
import { Icon } from '../../../library/icon';
import IconButton from '../../../library/icon-button';
import Stack from '../../../library/stack';
import { accent, ink } from '../../../library/theme';
import { Typography } from '../../../library/typography';
import { SPORT_ICONS } from '../../feed/sport-icons';

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

  const handleLogFlash = () => {};
  const handleLogSend = () => {};
  const handleLogTry = () => {};

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

            <Stack direction="horizontal" align="center">
              <Icon icon="location-pin" size="xs" color={ink.tertiary} />
              <Typography size="callout" color="tertiary">
                {session.location?.name ?? t('common.unknown')}
              </Typography>
            </Stack>
          </Stack>

          {/* Right */}
          {session.currentClimb?.name && (
            <Stack direction="vertical" align="end" gap="0">
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
            </Stack>
          )}
        </Stack>
      </Pressable>

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        >
          <Stack gap="md">
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
            </Stack>

            {/* {canStep && currentClimb && (
              <Stack direction="horizontal" align="center" justify="between">
                <Stack gap="2xs">
                  <Typography
                    size="overline"
                    color="secondary"
                    style={{ textTransform: 'uppercase' }}
                  >
                    {t('climbing.session_current_climb_label')}
                  </Typography>
                  <Typography weight="semibold">
                    {currentClimb.grade} {currentClimb.name}
                  </Typography>
                </Stack>
                <Stepper
                  value={attempts}
                  onChange={handleChangeAttempts}
                  min={1}
                  disabled={isUpdatingAttempts}
                />
              </Stack>
            )}

            <Button
              title={t('climbing.session_stop_button')}
              variant="destructive"
              icon="stop"
              fullWidth
              onPress={handleStop}
              disabled={isStopping}
            /> */}
          </Stack>
        </Animated.View>
      )}
    </Stack>
  );
};

export default TrainingSessionDetail;
