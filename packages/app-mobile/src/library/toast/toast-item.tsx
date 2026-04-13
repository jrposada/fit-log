import { FunctionComponent, useCallback, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SlideInDown,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { styles, variantStyles } from './toast.styles';
import type { ToastItem as ToastItemType } from './toast-context';

const AUTO_DISMISS_MS = 3000;
const SWIPE_THRESHOLD = 60;

type ToastItemProps = {
  toast: ToastItemType;
  onDismiss: (id: number) => void;
};

const ToastItem: FunctionComponent<ToastItemProps> = ({ toast, onDismiss }) => {
  const isDestructive = toast.variant === 'destructive';
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const dismiss = useCallback(() => onDismiss(toast.id), [onDismiss, toast.id]);

  useEffect(() => {
    if (isDestructive) return;

    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, isDestructive, dismiss]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = Math.min(0, e.translationY);
      const distance = Math.max(
        Math.abs(e.translationX),
        Math.abs(e.translationY)
      );
      opacity.value = Math.max(0.3, 1 - distance / (SWIPE_THRESHOLD * 2));
    })
    .onEnd((e) => {
      const swipedHorizontally = Math.abs(e.translationX) > SWIPE_THRESHOLD;
      const swipedUp = e.translationY < -SWIPE_THRESHOLD;

      if (swipedHorizontally || swipedUp) {
        translateX.value = withTiming(swipedUp ? 0 : e.translationX * 3);
        translateY.value = withTiming(swipedUp ? -200 : 0);
        opacity.value = withTiming(0, undefined, () => {
          scheduleOnRN(dismiss);
        });
      } else {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        opacity.value = withTiming(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        entering={SlideInDown.duration(250)}
        exiting={SlideOutUp.duration(200)}
        style={[
          styles.toast,
          variantStyles[toast.variant],
          animatedStyle,
        ]}
      >
        <Text style={styles.toastMessage}>{toast.message}</Text>
        {isDestructive && (
          <Pressable
            onPress={() => onDismiss(toast.id)}
            hitSlop={8}
            style={styles.dismissButton}
          >
            <Text style={styles.dismissText}>✕</Text>
          </Pressable>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default ToastItem;
