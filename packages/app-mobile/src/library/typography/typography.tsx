import { FunctionComponent, ReactNode } from 'react';
import { Text, TextProps as RNTextProps } from 'react-native';

import {
  colorMap,
  sizeStyles,
  TypographyColor,
  TypographySize,
  TypographyWeight,
  weightMap,
} from './typography.styles';

export interface TypographyProps extends Omit<RNTextProps, 'style'> {
  size?: TypographySize;
  color?: TypographyColor;
  weight?: TypographyWeight;
  align?: 'left' | 'center' | 'right';
  style?: RNTextProps['style'];
  children: ReactNode;
}

const Typography: FunctionComponent<TypographyProps> = ({
  size = 'body',
  color = 'primary',
  weight,
  align,
  style,
  children,
  ...textProps
}) => {
  return (
    <Text
      style={[
        sizeStyles[size],
        { color: colorMap[color] },
        weight != null && { fontWeight: weightMap[weight] },
        align != null && { textAlign: align },
        style,
      ]}
      {...textProps}
    >
      {children}
    </Text>
  );
};

export default Typography;
