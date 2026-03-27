import type React from 'react';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './footer.styles';

export interface ModalFooterProps {
  children: ReactNode;
}

function Footer({ children }: ModalFooterProps): React.ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
      {children}
    </View>
  );
}

export default Footer;
