import { FunctionComponent, PropsWithChildren } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { styles } from './section.styles';

export interface SectionProps {
  title?: string;
  style?: StyleProp<ViewStyle>;
}

const Section: FunctionComponent<PropsWithChildren<SectionProps>> = ({
  title,
  style,
  children,
}) => {
  return (
    <View style={[styles.base, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

export default Section;
