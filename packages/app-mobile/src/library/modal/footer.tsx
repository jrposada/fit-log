import type React from 'react';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export interface ModalFooterProps {
  children: ReactNode;
}

function Footer({ children }: ModalFooterProps): React.ReactElement {
  return <View style={styles.footer}>{children}</View>;
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default Footer;
