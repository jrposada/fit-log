import type React from 'react';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { styles } from './header.styles';

export interface ModalHeaderProps {
  children: ReactNode;
}

function Header({ children }: ModalHeaderProps): React.ReactElement {
  return <View style={styles.header}>{children}</View>;
}

export default Header;
