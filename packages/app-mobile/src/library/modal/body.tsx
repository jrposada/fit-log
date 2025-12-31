import type React from 'react';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { styles } from './body.styles';

export interface ModalBodyProps {
  children: ReactNode;
}

function Body({ children }: ModalBodyProps): React.ReactElement {
  return <View style={styles.body}>{children}</View>;
}

export default Body;
