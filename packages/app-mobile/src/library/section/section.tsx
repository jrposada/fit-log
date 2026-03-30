import { FunctionComponent, PropsWithChildren } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { spacing as spacingTokens } from '../theme';
import { styles } from './section.styles';

export interface SectionProps {
  title?: string;
  level?: 1 | 2;
  spacing?: keyof typeof spacingTokens;
  gap?: keyof typeof spacingTokens;
  noPadding?: boolean;
  style?: StyleProp<ViewStyle>;
}

const titleLevelStyles = {
  1: styles.titleLevel1,
  2: styles.titleLevel2,
} as const;

const Section: FunctionComponent<PropsWithChildren<SectionProps>> = ({
  title,
  level = 1,
  spacing,
  gap,
  noPadding = false,
  style,
  children,
}) => {
  return (
    <View
      style={[
        styles.base,
        noPadding && styles.noPadding,
        spacing != null && { marginTop: spacingTokens[spacing] },
        gap != null && { gap: spacingTokens[gap] },
        style,
      ]}
    >
      {title && (
        <Text style={[styles.title, titleLevelStyles[level]]}>{title}</Text>
      )}
      {children}
    </View>
  );
};

export default Section;
