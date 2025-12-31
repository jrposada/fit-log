import type React from 'react';
import { ReactNode } from 'react';
import { Modal as RNModal, TouchableOpacity, View } from 'react-native';

import { styles } from './modal.styles';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  fullscreen?: boolean;
}

function Modal({
  visible,
  onClose,
  children,
  fullscreen = false,
}: ModalProps): React.ReactElement {
  return (
    <RNModal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
      hardwareAccelerated
    >
      <TouchableOpacity
        style={fullscreen ? styles.overlayFullscreen : styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[fullscreen ? styles.containerFullscreen : styles.container]}
          onStartShouldSetResponder={() => true}
        >
          {children}
        </View>
      </TouchableOpacity>
    </RNModal>
  );
}

export default Modal;
