import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Climb } from '@shared/models/climb/climb';
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

type Data = Omit<Climb, 'image' | 'location'> & {
  image: string;
  location: string;
};

export interface ClimbCardProps {
  climb: Data;
  /** If true, the card auto-peeks to hint at the swipe action */
  shouldPeek?: boolean;
  /** Called after peek animation completes */
  onPeekDone?: () => void;
}

type ClimbCardNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

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
      location: climb.location,
      sector: climb.sector.id,
      status: 'send',
      attempts: 1,
    });
  }, [climb, climbHistoriesPut]);

  const handleLogPress = useCallback(() => {
    swipeableRef.current?.close();
    handleLog();
  }, [handleLog]);

  const handleLongPress = () => {
    Alert.alert(climb.name, undefined, [
      {
        text: t('climbing.log_action'),
        onPress: handleLog,
      },
      {
        text: t('climbing.browse_view_details'),
        onPress: handleClimbPress,
      },
      { text: t('actions.cancel'), style: 'cancel' },
    ]);
  };

  const renderRightActions = (
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) =>
    RightAction(prog, drag, {
      onLog: handleLogPress,
      logDisabled: loading,
      label: t('climbing.log_action'),
    });

  return (
    <View style={styles.container}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        friction={2}
        rightThreshold={40}
        renderRightActions={renderRightActions}
        overshootRight={false}
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
          <View style={styles.topRow}>
            <Text style={styles.title}>
              <Text style={{ color: beautifyGradeColor(climb.grade) }}>
                ● {climb.grade}
              </Text>{' '}
              | {climb.name}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.sector}>{climb.sector.name}</Text>
            {loading && <ActivityIndicator size="small" />}
          </View>
        </Pressable>
      </ReanimatedSwipeable>
    </View>
  );
};

export default ClimbCard;
