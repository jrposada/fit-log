import type React from 'react';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export interface ModalHeaderProps {
  children: ReactNode;
}

function Header({ children }: ModalHeaderProps): React.ReactElement {
  return <View style={styles.header}>{children}</View>;
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default Header;
