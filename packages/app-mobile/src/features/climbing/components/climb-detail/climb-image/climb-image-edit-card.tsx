import { FunctionComponent, useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { Typography } from '../../../../../library/typography';
import { JOYSTICK_RADIUS, styles } from './climb-image-edit-card.styles';

const DEAD_ZONE = 3;
const MAX_SPEED = 0.006; // normalized units per tick at full deflection
const TICK_MS = 32; // ~30fps

interface ClimbImageEditCardProps {
  selectionType: 'hold' | 'spline';
  onMove: (dx: number, dy: number) => void;
  onResize?: ((scaleFactor: number) => void) | false;
}

const ClimbImageEditCard: FunctionComponent<ClimbImageEditCardProps> = ({
  selectionType,
  onMove,
  onResize,
}) => {
  const knobX = useSharedValue(0);
  const knobY = useSharedValue(0);
  const stickX = useSharedValue(0);
  const stickY = useSharedValue(0);
  const prevScale = useSharedValue(1);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const startTick = useCallback(() => {
    if (tickRef.current) return;
    tickRef.current = setInterval(() => {
      const sx = stickX.value;
      const sy = stickY.value;
      if (Math.abs(sx) < 0.01 && Math.abs(sy) < 0.01) return;
      onMoveRef.current(sx * MAX_SPEED, sy * MAX_SPEED);
    }, TICK_MS);
  }, [stickX, stickY]);

  const stopTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => {
    return stopTick;
  }, [stopTick]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      scheduleOnRN(startTick);
    })
    .onUpdate((e) => {
      'worklet';
      if (e.numberOfPointers > 1) return;

      // Clamp knob visual to circular boundary
      const dist = Math.sqrt(e.translationX ** 2 + e.translationY ** 2);
      const clamped = Math.min(dist, JOYSTICK_RADIUS);
      const angle = Math.atan2(e.translationY, e.translationX);
      knobX.value = clamped * Math.cos(angle);
      knobY.value = clamped * Math.sin(angle);

      // Dead zone
      if (dist < DEAD_ZONE) {
        stickX.value = 0;
        stickY.value = 0;
        return;
      }

      // Normalize displacement to -1..1
      stickX.value = Math.max(
        -1,
        Math.min(1, e.translationX / JOYSTICK_RADIUS)
      );
      stickY.value = Math.max(
        -1,
        Math.min(1, e.translationY / JOYSTICK_RADIUS)
      );
    })
    .onEnd(() => {
      'worklet';
      knobX.value = 0;
      knobY.value = 0;
      stickX.value = 0;
      stickY.value = 0;
      scheduleOnRN(stopTick);
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      'worklet';
      prevScale.value = 1;
    })
    .onUpdate((e) => {
      'worklet';
      if (!onResize) return;
      const scaleRatio = e.scale / prevScale.value;
      prevScale.value = e.scale;
      scheduleOnRN(onResize, scaleRatio);
    });

  const composed = Gesture.Simultaneous(panGesture, pinchGesture);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knobX.value }, { translateY: knobY.value }],
  }));

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.card}>
        <View style={styles.joystickCircle}>
          <Typography
            size="caption"
            style={[styles.directionHint, styles.hintUp]}
          >
            ↑
          </Typography>
          <Typography
            size="caption"
            style={[styles.directionHint, styles.hintDown]}
          >
            ↓
          </Typography>
          <Typography
            size="caption"
            style={[styles.directionHint, styles.hintLeft]}
          >
            ←
          </Typography>
          <Typography
            size="caption"
            style={[styles.directionHint, styles.hintRight]}
          >
            →
          </Typography>

          <Animated.View style={[styles.knob, knobStyle]} />
        </View>

        <View style={styles.hints}>
          <Typography size="caption" color="secondary">
            Drag to move
          </Typography>
          {selectionType === 'hold' && (
            <Typography size="caption" color="secondary">
              Pinch to resize
            </Typography>
          )}
        </View>
      </View>
    </GestureDetector>
  );
};

export default ClimbImageEditCard;
