import { FunctionComponent, PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { spacing as spacingTokens } from '../theme';

type SpacingToken = keyof typeof spacingTokens;

export interface StackProps {
  direction?: 'vertical' | 'horizontal';
  gap?: SpacingToken;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  padding?: SpacingToken;
  paddingHorizontal?: SpacingToken;
  paddingVertical?: SpacingToken;
  flex?: boolean;
  style?: StyleProp<ViewStyle>;
}

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const;

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
} as const;

const Stack: FunctionComponent<PropsWithChildren<StackProps>> = ({
  direction = 'vertical',
  gap,
  align,
  justify,
  padding,
  paddingHorizontal,
  paddingVertical,
  flex,
  style,
  children,
}) => {
  const computedStyle: ViewStyle = {
    ...(direction === 'horizontal' && { flexDirection: 'row' }),
    ...(gap != null && { gap: spacingTokens[gap] }),
    ...(align != null && { alignItems: alignMap[align] }),
    ...(justify != null && { justifyContent: justifyMap[justify] }),
    ...(padding != null && { padding: spacingTokens[padding] }),
    ...(paddingHorizontal != null && {
      paddingHorizontal: spacingTokens[paddingHorizontal],
    }),
    ...(paddingVertical != null && {
      paddingVertical: spacingTokens[paddingVertical],
    }),
    ...(flex && { flex: 1 }),
  };

  return <View style={[computedStyle, style]}>{children}</View>;
};

export default Stack;
