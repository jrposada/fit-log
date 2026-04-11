import { FunctionComponent } from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

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
  onPress?: () => void;
}

const Badge: FunctionComponent<BadgeProps> = ({
  label,
  variant,
  size = 'sm',
  style,
  textStyle,
  onPress,
}) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      style={[styles.base, s.container, v.container, style]}
    >
      <Text style={[styles.text, s.text, v.text, textStyle]}>{label}</Text>
    </Wrapper>
  );
};

export default Badge;
