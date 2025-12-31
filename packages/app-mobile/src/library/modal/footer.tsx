import type React from 'react';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { styles } from './footer.styles';

export interface ModalFooterProps {
  children: ReactNode;
}

function Footer({ children }: ModalFooterProps): React.ReactElement {
  return <View style={styles.footer}>{children}</View>;
}

export default Footer;
