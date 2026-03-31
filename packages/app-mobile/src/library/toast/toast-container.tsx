import { FunctionComponent, useContext } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '../theme';
import { styles } from './toast.styles';
import { ToastContext } from './toast-context';
import ToastItem from './toast-item';

const ToastContainer: FunctionComponent = () => {
  const insets = useSafeAreaInsets();
  const context = useContext(ToastContext);

  if (!context || context.visibleToasts.length === 0) return null;

  return (
    <View
      style={[styles.container, { top: insets.top + spacing.sm }]}
      pointerEvents="box-none"
    >
      {context.visibleToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={context.dismiss} />
      ))}
    </View>
  );
};

export default ToastContainer;
