import { FunctionComponent } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

import {
  BadgeSize,
  BadgeVariant,
  sizeStyles,
  styles,
  variantStyles,
} from './badge.styles';

export interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Badge: FunctionComponent<BadgeProps> = ({
  label,
  variant,
  size = 'sm',
  style,
  textStyle,
}) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <View style={[styles.base, s.container, v.container, style]}>
      <Text style={[styles.text, s.text, v.text, textStyle]}>{label}</Text>
    </View>
  );
};

export default Badge;
