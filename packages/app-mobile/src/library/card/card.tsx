import * as Haptics from 'expo-haptics';
import {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  ACTION_WIDTH,
  highlightWidths,
  sizeStyles,
  styles,
} from './card.styles';

const LONG_SWIPE_THRESHOLD = ACTION_WIDTH * 2;

export interface SwipeAction {
  label: string;
  icon: string;
  baseColor: string;
  emphasisColor: string;
  onAction: () => void;
}

export interface CardProps {
  variant?: 'elevated' | 'elevatedStrong' | 'flat' | 'subdued';
  direction?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  highlight?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Action revealed when swiping right (left side background) */
  leftAction?: SwipeAction | false;
  /** Action revealed when swiping left (right side background) */
  rightAction?: SwipeAction | false;
  /** If true, the card auto-peeks to hint at the swipe action */
  shouldPeek?: boolean;
  /** Called after peek animation completes */
  onPeekDone?: () => void;
  /** Disables press interaction */
  disabled?: boolean;
}

function triggerHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

interface SwipeBackgroundProps {
  side: 'left' | 'right';
  label: string;
  icon: string;
  baseColor: string;
  emphasisColor: string;
  drag: SharedValue<number>;
  onDragUpdate: (value: number) => void;
}

function SwipeBackground({
  drag,
  onDragUpdate,
  ...props
}: SwipeBackgroundProps) {
  const thresholdCrossed = useDerivedValue(() => {
    return Math.abs(drag.value) >= LONG_SWIPE_THRESHOLD;
  });

  useAnimatedReaction(
    () => drag.value,
    (current) => {
      scheduleOnRN(onDragUpdate, current);
    }
  );

  useAnimatedReaction(
    () => thresholdCrossed.value,
    (crossed, previousCrossed) => {
      if (crossed && !previousCrossed) {
        scheduleOnRN(triggerHaptic);
      }
    }
  );

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      Math.abs(drag.value),
      [0, LONG_SWIPE_THRESHOLD],
      [props.baseColor, props.emphasisColor]
    ),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(thresholdCrossed.value ? 1.2 : 1.0, { damping: 12 }),
      },
    ],
  }));

  const containerStyle =
    props.side === 'right'
      ? styles.swipeBackgroundRight
      : styles.swipeBackgroundLeft;

  return (
    <Animated.View style={[containerStyle, backgroundStyle]}>
      <Animated.View style={[styles.swipeContent, iconStyle]}>
        <Text style={styles.swipeIcon}>{props.icon}</Text>
        <Text style={styles.swipeLabel}>{props.label}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const Card: FunctionComponent<PropsWithChildren<CardProps>> = ({
  variant = 'elevated',
  direction = 'vertical',
  size = 'md',
  highlight,
  onPress,
  style,
  leftAction,
  rightAction,
  shouldPeek,
  onPeekDone,
  disabled,
  children,
}) => {
  const hasSwipe = !!leftAction || !!rightAction;

  const cardStyle = [
    styles.base,
    sizeStyles[size],
    styles[variant],
    direction === 'horizontal' && styles.horizontal,
    highlight !== undefined && {
      borderLeftColor: highlight,
      borderLeftWidth: highlightWidths[size],
    },
    style,
  ];

  const cardContent = onPress ? (
    <Pressable
      style={({ pressed }) => [
        ...cardStyle,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </Pressable>
  ) : (
    <View style={cardStyle}>{children}</View>
  );

  if (!hasSwipe) {
    return cardContent;
  }

  return (
    <SwipeWrapper
      leftAction={leftAction}
      rightAction={rightAction}
      shouldPeek={shouldPeek}
      onPeekDone={onPeekDone}
    >
      {cardContent}
    </SwipeWrapper>
  );
};

interface SwipeWrapperProps {
  leftAction?: SwipeAction | false;
  rightAction?: SwipeAction | false;
  shouldPeek?: boolean;
  onPeekDone?: () => void;
}

const SwipeWrapper: FunctionComponent<PropsWithChildren<SwipeWrapperProps>> = ({
  leftAction,
  rightAction,
  shouldPeek,
  onPeekDone,
  children,
}) => {
  const lastDragRef = useRef(0);
  const swipeableRef = useRef<SwipeableMethods>(null);

  const handleDragUpdate = useCallback((value: number) => {
    lastDragRef.current = value;
  }, []);

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

  const handleSwipeableWillOpen = useCallback(
    (direction: 'left' | 'right') => {
      swipeableRef.current?.close();
      if (Math.abs(lastDragRef.current) < LONG_SWIPE_THRESHOLD) return;

      if (direction === 'right' && leftAction) {
        leftAction.onAction();
      } else if (direction === 'left' && rightAction) {
        rightAction.onAction();
      }
    },
    [leftAction, rightAction]
  );

  const renderRightActions = rightAction
    ? (_prog: SharedValue<number>, drag: SharedValue<number>) => (
        <SwipeBackground
          side="right"
          label={rightAction.label}
          icon={rightAction.icon}
          baseColor={rightAction.baseColor}
          emphasisColor={rightAction.emphasisColor}
          drag={drag}
          onDragUpdate={handleDragUpdate}
        />
      )
    : undefined;

  const renderLeftActions = leftAction
    ? (_prog: SharedValue<number>, drag: SharedValue<number>) => (
        <SwipeBackground
          side="left"
          label={leftAction.label}
          icon={leftAction.icon}
          baseColor={leftAction.baseColor}
          emphasisColor={leftAction.emphasisColor}
          drag={drag}
          onDragUpdate={handleDragUpdate}
        />
      )
    : undefined;

  return (
    <View style={styles.swipeContainer}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        friction={1}
        rightThreshold={40}
        leftThreshold={40}
        overshootRight={true}
        overshootLeft={true}
        onSwipeableWillOpen={handleSwipeableWillOpen}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        containerStyle={styles.swipeableRow}
      >
        {children}
      </ReanimatedSwipeable>
    </View>
  );
};

export default Card;
