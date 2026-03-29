import { FunctionComponent, PropsWithChildren } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { spacing as spacingTokens } from '../theme';
import { styles } from './section.styles';

export interface SectionProps {
  title?: string;
  spacing?: keyof typeof spacingTokens;
  style?: StyleProp<ViewStyle>;
}

const Section: FunctionComponent<PropsWithChildren<SectionProps>> = ({
  title,
  spacing,
  style,
  children,
}) => {
  return (
    <View
      style={[
        styles.base,
        spacing != null && { marginTop: spacingTokens[spacing] },
        style,
      ]}
    >
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

export default Section;
