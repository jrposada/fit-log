import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClimbGrade } from '@shared/models/climb/climb';
import { useClimbHistoriesPut } from '@shared-react/api/climb-histories/use-climb-histories-put';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { FunctionComponent, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { ClimbingParamList } from '../../types';
import { ACTION_WIDTH, styles } from './climb-card.styles';

export interface ClimbCardData {
  id: string;
  name: string;
  grade: ClimbGrade;
  location: { id: string; name: string };
  sector: { id: string; name: string };
  userStatus?: {
    status: 'send' | 'flash' | 'attempt' | 'project';
    attempts?: number;
    lastTriedDate?: string;
  };
}

export interface ClimbCardProps {
  climb: ClimbCardData;
  /** If true, the card auto-peeks to hint at the swipe action */
  shouldPeek?: boolean;
  /** Called after peek animation completes */
  onPeekDone?: () => void;
}

type ClimbCardNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

function formatRelativeDate(
  isoDate: string,
  t: (key: string, opts?: Record<string, unknown>) => string
): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('climbing.relative_today');
  if (diffDays === 1) return t('climbing.relative_yesterday');
  if (diffDays < 14)
    return t('climbing.relative_days_ago', { count: diffDays });
  if (diffDays < 60)
    return t('climbing.relative_weeks_ago', {
      count: Math.floor(diffDays / 7),
    });
  return t('climbing.relative_months_ago', {
    count: Math.floor(diffDays / 30),
  });
}

function StatusBadge({
  status,
  t,
}: {
  status: 'send' | 'flash' | 'attempt' | 'project';
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  switch (status) {
    case 'send':
      return (
        <View style={[styles.badgeBase, styles.badgeSend]}>
          <Text style={[styles.badgeText, styles.badgeTextSend]}>
            {t('climbing.status_sent')}
          </Text>
        </View>
      );
    case 'flash':
      return (
        <View style={[styles.badgeBase, styles.badgeFlash]}>
          <Text style={[styles.badgeText, styles.badgeTextFlash]}>
            {t('climbing.status_flash')}
          </Text>
        </View>
      );
    case 'project':
      return (
        <View style={[styles.badgeBase, styles.badgeProject]}>
          <Text style={[styles.badgeText, styles.badgeTextProject]}>
            {t('climbing.status_project_label')}
          </Text>
        </View>
      );
    case 'attempt':
      return null;
    default:
      return null;
  }
}

function RightAction(
  _prog: SharedValue<number>,
  drag: SharedValue<number>,
  props: { onLog: () => void; logDisabled: boolean; label: string }
) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value + ACTION_WIDTH }],
  }));

  return (
    <Animated.View style={[styles.rightActions, animatedStyle]}>
      <Pressable
        style={styles.actionButton}
        onPress={props.onLog}
        disabled={props.logDisabled}
      >
        <Text style={styles.actionText}>{props.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

function LeftAction(
  _prog: SharedValue<number>,
  drag: SharedValue<number>,
  props: {
    onProject: () => void;
    disabled: boolean;
    label: string;
  }
) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value - ACTION_WIDTH }],
  }));

  return (
    <Animated.View style={[styles.leftActions, animatedStyle]}>
      <Pressable
        style={styles.projectActionButton}
        onPress={props.onProject}
        disabled={props.disabled}
      >
        <Text style={styles.actionText}>{props.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const ClimbCard: FunctionComponent<ClimbCardProps> = ({
  climb,
  shouldPeek,
  onPeekDone,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbCardNavigationProp>();
  const swipeableRef = useRef<SwipeableMethods>(null);
  const climbHistoriesPut = useClimbHistoriesPut();
  const loading = climbHistoriesPut.isPending;

  const status = climb.userStatus?.status;
  const isCompleted = status === 'send' || status === 'flash';
  const isProject = status === 'project';
  const showLogSwipe = !isCompleted;
  const showProjectSwipe = !isCompleted && !isProject;

  const showMetaRow =
    climb.userStatus?.lastTriedDate &&
    !isCompleted &&
    (status === 'attempt' || (isProject && climb.userStatus?.attempts));

  useEffect(() => {
    if (shouldPeek) {
      const timer = setTimeout(() => {
        swipeableRef.current?.openRight();
        setTimeout(() => {
          swipeableRef.current?.close();
          onPeekDone?.();
        }, 800);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [shouldPeek, onPeekDone]);

  const handleClimbPress = () => {
    navigation.navigate('ClimbDetail', { climbId: climb.id });
  };

  const handleLog = useCallback(() => {
    climbHistoriesPut.mutate({
      climb: climb.id,
      location: climb.location.id,
      sector: climb.sector.id,
      status: 'send',
      attempts: 1,
    });
  }, [climb, climbHistoriesPut]);

  const handleAddProject = useCallback(() => {
    climbHistoriesPut.mutate({
      climb: climb.id,
      location: climb.location.id,
      sector: climb.sector.id,
      status: 'project',
    });
  }, [climb, climbHistoriesPut]);

  const handleLogPress = useCallback(() => {
    swipeableRef.current?.close();
    handleLog();
  }, [handleLog]);

  const handleProjectPress = useCallback(() => {
    swipeableRef.current?.close();
    handleAddProject();
  }, [handleAddProject]);

  const handleLongPress = () => {
    const buttons: { text: string; onPress?: () => void; style?: 'cancel' }[] =
      [];

    if (!isCompleted) {
      buttons.push({ text: t('climbing.log_action'), onPress: handleLog });
    }
    if (showProjectSwipe) {
      buttons.push({
        text: t('climbing.project_action'),
        onPress: handleAddProject,
      });
    }
    buttons.push({
      text: t('climbing.browse_view_details'),
      onPress: handleClimbPress,
    });
    buttons.push({ text: t('actions.cancel'), style: 'cancel' });

    Alert.alert(climb.name, undefined, buttons);
  };

  const renderRightActions = showLogSwipe
    ? (prog: SharedValue<number>, drag: SharedValue<number>) =>
        RightAction(prog, drag, {
          onLog: handleLogPress,
          logDisabled: loading,
          label: t('climbing.log_action'),
        })
    : undefined;

  const renderLeftActions = showProjectSwipe
    ? (prog: SharedValue<number>, drag: SharedValue<number>) =>
        LeftAction(prog, drag, {
          onProject: handleProjectPress,
          disabled: loading,
          label: t('climbing.project_action'),
        })
    : undefined;

  return (
    <View style={styles.container}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        friction={2}
        rightThreshold={40}
        leftThreshold={40}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        containerStyle={styles.swipeableRow}
      >
        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
            loading && styles.cardLoading,
          ]}
          onPress={handleClimbPress}
          onLongPress={handleLongPress}
          delayLongPress={400}
          disabled={loading}
        >
          {/* Row 1: Grade + Name + Status Badge */}
          <View style={styles.topRow}>
            <Text style={styles.title}>
              <Text style={{ color: beautifyGradeColor(climb.grade) }}>
                ● {climb.grade}
              </Text>{' '}
              | {climb.name}
            </Text>
            {climb.userStatus && (
              <StatusBadge status={climb.userStatus.status} t={t} />
            )}
          </View>

          {/* Row 2: Sector · Location */}
          <View style={styles.contextRow}>
            <Text style={styles.contextText}>
              {climb.sector.name} · {climb.location.name}
            </Text>
            {loading && <ActivityIndicator size="small" />}
          </View>

          {/* Row 3: Meta (conditional) */}
          {showMetaRow && (
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>
                {t('climbing.last_tried', {
                  date: formatRelativeDate(climb.userStatus!.lastTriedDate!, t),
                })}
              </Text>
              {climb.userStatus!.attempts ? (
                <>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>
                    {t('climbing.attempts_count', {
                      count: climb.userStatus!.attempts,
                    })}
                  </Text>
                </>
              ) : null}
            </View>
          )}
        </Pressable>
      </ReanimatedSwipeable>
    </View>
  );
};

export default ClimbCard;
