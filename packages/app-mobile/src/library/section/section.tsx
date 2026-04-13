import { FunctionComponent, PropsWithChildren } from 'react';
import { StyleProp, Text, ViewStyle } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { spacing as spacingTokens } from '../theme';
import { styles } from './section.styles';

export interface SectionProps {
  title?: string;
  variant?: 'filled' | 'transparent';
  level?: 1 | 2;
  direction?: 'horizontal' | 'vertical';
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
  variant = 'filled',
  level = 1,
  direction = 'vertical',
  spacing,
  gap,
  noPadding = false,
  style,
  children,
}) => {
  return (
    <Animated.View
      layout={LinearTransition}
      style={[
        styles.base,
        styles[variant],
        styles[direction],
        (noPadding || variant === 'transparent') && styles.noPadding,
        spacing != null && { marginTop: spacingTokens[spacing] },
        gap != null && { gap: spacingTokens[gap] },
        style,
      ]}
    >
      {title && (
        <Text style={[styles.title, titleLevelStyles[level]]}>{title}</Text>
      )}
      {children}
    </Animated.View>
  );
};

export default Section;
