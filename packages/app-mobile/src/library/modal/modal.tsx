import type React from 'react';
import { ReactNode } from 'react';
import {
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayFullscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '100%',
    maxHeight: '90%',
    display: 'flex',
    backgroundColor: '#fff',
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    overflow: 'hidden',
  },
  containerFullscreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});

export default Modal;
