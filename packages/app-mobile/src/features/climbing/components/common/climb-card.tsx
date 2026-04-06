import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Climb } from '@shared/models/climb/climb';
import { ClimbHistory } from '@shared/models/climb-history/climb-history';
import { Location } from '@shared/models/location/location';
import { Sector } from '@shared/models/sector/sector';
import { useClimbHistoriesPut } from '@shared-react/api/climb-histories/use-climb-histories-put';
import { useClimbHistoryProject } from '@shared-react/api/climb-histories/use-climb-history-project';
import { formatRelativeDate } from '@shared-react/beautifiers/date';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

import Card, { SwipeAction } from '../../../../library/card';
import Separator from '../../../../library/separator';
import Stack from '../../../../library/stack';
import { accent, semantic } from '../../../../library/theme';
import { Typography } from '../../../../library/typography';
import { ClimbingParamList } from '../../types';
import ClimbStatusBadge from './climb-status-badge';
import GradeBadge from './grade-badge';

const SWIPE_COLORS = {
  rightBase: semantic.success,
  rightEmphasis: accent.emphasis,
  leftBase: accent.primary,
  leftEmphasis: accent.emphasis,
} as const;

type ClimbCardNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

interface ClimbCardProps {
  climb: Omit<Climb, 'image' | 'location' | 'sector'>;
  location: Pick<Location, 'id' | 'name'>;
  sector: Pick<Sector, 'id' | 'name'>;
  history?: ClimbHistory;
  shouldPeek?: boolean;
  onPeekDone?: () => void;
}

const ClimbCard: FunctionComponent<ClimbCardProps> = ({
  climb,
  location,
  sector,
  history,
  shouldPeek,
  onPeekDone,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbCardNavigationProp>();

  const climbHistoriesPut = useClimbHistoriesPut();
  const climbHistoryProject = useClimbHistoryProject();

  const loading = climbHistoriesPut.isPending || climbHistoryProject.isPending;

  const isCompleted = history?.status === 'send' || history?.status === 'flash';
  const totalAttempts = history?.tries.reduce(
    (sum, t) => sum + (t.attempts ?? 0),
    0
  );
  const lastTry: ClimbHistory['tries'][number] | undefined =
    history?.tries[history.tries?.length - 1];

  const handleClimbPress = () => {
    navigation.navigate('ClimbDetail', { climbId: climb.id });
  };

  const handleLog = useCallback(() => {
    climbHistoriesPut.mutate({
      climb: climb.id,
      location: location.id,
      sector: sector.id,
      status: 'send',
      attempts: 1,
    });
  }, [climb.id, climbHistoriesPut, location.id, sector.id]);

  const handleToggleProject = useCallback(() => {
    climbHistoryProject.mutate({
      climb: climb.id,
      location: location.id,
      sector: sector.id,
      isProject: !history?.isProject,
    });
  }, [
    climb.id,
    climbHistoryProject,
    history?.isProject,
    location.id,
    sector.id,
  ]);

  const rightAction = useMemo<SwipeAction | false>(
    () =>
      !isCompleted && {
        label: t('climbing.log_action'),
        icon: '✓',
        baseColor: SWIPE_COLORS.rightBase,
        emphasisColor: SWIPE_COLORS.rightEmphasis,
        onAction: handleLog,
      },
    [handleLog, isCompleted, t]
  );

  const leftAction = useMemo<SwipeAction | false>(
    () =>
      !isCompleted && {
        label: history?.isProject
          ? t('climbing.unproject_action')
          : t('climbing.project_action'),
        icon: '★',
        baseColor: SWIPE_COLORS.leftBase,
        emphasisColor: SWIPE_COLORS.leftEmphasis,
        onAction: handleToggleProject,
      },
    [handleToggleProject, history?.isProject, isCompleted, t]
  );

  return (
    <Card
      leftAction={leftAction}
      rightAction={rightAction}
      shouldPeek={shouldPeek}
      onPeekDone={onPeekDone}
      onPress={handleClimbPress}
      disabled={loading}
    >
      <Stack direction="horizontal" align="center" gap="sm" spacer="xs">
        <GradeBadge grade={climb.grade} variant="ghost" />
        <Separator
          direction="vertical"
          size="md"
          variant="strong"
          inset="2xs"
        />
        <Typography size="body" weight="semibold" style={{ flex: 1 }}>
          {climb.name}
        </Typography>
        {history?.status && (
          <ClimbStatusBadge
            status={history.status}
            isProject={history.isProject}
          />
        )}
      </Stack>

      <Stack
        direction="horizontal"
        align="center"
        justify="between"
        spacer="xs"
      >
        <Stack direction="horizontal" align="center" gap="sm">
          <Typography size="callout" color="secondary">
            {sector.name}
          </Typography>
          <Separator direction="dot" />
          <Typography size="callout" color="secondary">
            {location.name}
          </Typography>
        </Stack>
        {loading && <ActivityIndicator size="small" />}
      </Stack>

      {/* Row 3: Meta (conditional) */}
      {lastTry?.date && (
        <Stack direction="horizontal" align="center" gap="sm">
          <Typography size="caption" color="tertiary">
            {t('climbing.last_tried', {
              date: formatRelativeDate(lastTry.date, t),
            })}
          </Typography>
          {totalAttempts && (
            <>
              <Separator direction="dot" />
              <Typography size="caption" color="tertiary">
                {t('climbing.attempts_count', {
                  count: totalAttempts,
                })}
              </Typography>
            </>
          )}
        </Stack>
      )}
    </Card>
  );
};

export default ClimbCard;
