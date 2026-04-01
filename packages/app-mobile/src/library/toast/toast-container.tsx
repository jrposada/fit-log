import { FunctionComponent, useContext } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';

import { spacing } from '../theme';
import { styles } from './toast.styles';
import { ToastContext } from './toast-context';
import ToastItem from './toast-item';

const Overlay = Platform.OS === 'ios' ? FullWindowOverlay : View;

const ToastContainer: FunctionComponent = () => {
  const insets = useSafeAreaInsets();
  const context = useContext(ToastContext);

  if (!context || context.visibleToasts.length === 0) return null;

  return (
    <Overlay>
      <View
        style={[styles.container, { top: insets.top + spacing.sm }]}
        pointerEvents="box-none"
      >
        {context.visibleToasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={context.dismiss} />
        ))}
      </View>
    </Overlay>
  );
};

export default ToastContainer;
