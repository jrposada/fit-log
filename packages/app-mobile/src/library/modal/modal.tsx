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
}

function Modal({ visible, onClose, children }: ModalProps): React.ReactElement {
  return (
    <RNModal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
      hardwareAccelerated
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.container]} onStartShouldSetResponder={() => true}>
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
  container: {
    width: '100%',
    maxHeight: '90%',
    display: 'flex',
    backgroundColor: '#fff',
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    overflow: 'hidden',
  },
});

export default Modal;
