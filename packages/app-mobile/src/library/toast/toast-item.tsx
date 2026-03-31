import { FunctionComponent, useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { SlideInDown, SlideOutUp } from 'react-native-reanimated';

import { styles } from './toast.styles';
import type { ToastItem as ToastItemType } from './toast-context';

const AUTO_DISMISS_MS = 3000;

type ToastItemProps = {
  toast: ToastItemType;
  onDismiss: (id: number) => void;
};

const ToastItem: FunctionComponent<ToastItemProps> = ({ toast, onDismiss }) => {
  const isDestructive = toast.variant === 'destructive';

  useEffect(() => {
    if (isDestructive) return;

    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, isDestructive, onDismiss]);

  return (
    <Animated.View
      entering={SlideInDown.duration(250)}
      exiting={SlideOutUp.duration(200)}
      style={[
        styles.toast,
        isDestructive ? styles.toastDestructive : styles.toastSuccess,
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
  );
};

export default ToastItem;
