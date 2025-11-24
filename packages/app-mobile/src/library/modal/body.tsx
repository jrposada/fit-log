import type React from 'react';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export interface ModalBodyProps {
  children: ReactNode;
}

function Body({ children }: ModalBodyProps): React.ReactElement {
  return <View style={styles.body}>{children}</View>;
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

export default Body;
