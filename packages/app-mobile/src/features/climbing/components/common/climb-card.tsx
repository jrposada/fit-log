import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Climb } from '@shared/models/climb/climb';
import { ClimbHistory } from '@shared/models/climb-history/climb-history';
import { Location } from '@shared/models/location/location';
import { Sector } from '@shared/models/sector/sector';
import { useClimbHistoriesPut } from '@shared-react/api/climb-histories/use-climb-histories-put';
import { useClimbHistoryProject } from '@shared-react/api/climb-histories/use-climb-history-project';
import { formatRelativeDate } from '@shared-react/beautifiers/date';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import { Badge } from '../../../../library/badge';
import Card, { SwipeAction } from '../../../../library/card';
import { Typography } from '../../../../library/typography';
import { ClimbingParamList } from '../../types';
import { styles, SWIPE_COLORS } from './climb-card.styles';

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
      style={[styles.card, loading && styles.cardLoading]}
    >
      {/* Row 1: Grade + Name + Status Badge */}
      <View style={styles.topRow}>
        <Typography size="body" weight="semibold" style={{ flex: 1 }}>
          <Typography style={{ color: beautifyGradeColor(climb.grade) }}>
            ● {climb.grade}
          </Typography>{' '}
          | {climb.name}
        </Typography>
        {history?.status && (
          <View style={styles.badgeRow}>
            {history.isProject && (
              <Badge
                label={t('climbing.status_project_label')}
                variant="info"
              />
            )}
            {history.status === 'send' && (
              <Badge label={t('climbing.status_sent')} variant="success" />
            )}
            {history.status === 'flash' && (
              <Badge label={t('climbing.status_flash')} variant="success" />
            )}
          </View>
        )}
      </View>

      {/* Row 2: Sector · Location */}
      <View style={styles.contextRow}>
        <Typography size="callout" color="secondary">
          {sector.name} · {location.name}
        </Typography>
        {loading && <ActivityIndicator size="small" />}
      </View>

      {/* Row 3: Meta (conditional) */}
      {lastTry?.date && (
        <View style={styles.metaRow}>
          <Typography size="caption" color="tertiary">
            {t('climbing.last_tried', {
              date: formatRelativeDate(lastTry.date, t),
            })}
          </Typography>
          {totalAttempts ? (
            <>
              <Typography size="caption" color="tertiary">
                ·
              </Typography>
              <Typography size="caption" color="tertiary">
                {t('climbing.attempts_count', {
                  count: totalAttempts,
                })}
              </Typography>
            </>
          ) : null}
        </View>
      )}
    </Card>
  );
};

export default ClimbCard;
