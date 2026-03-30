import { FunctionComponent } from 'react';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';

import {
  sizeIconStyles,
  sizeStyles,
  sizeTextStyles,
  styles,
  variantColors,
} from './button.styles';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: keyof typeof variantColors;
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: FunctionComponent<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled = false,
  style,
}) => {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyles[size],
        icon && styles.baseWithIcon,
        { backgroundColor: variantColors[variant] },
        isOutline && styles.outline,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <Text style={[styles.icon, sizeIconStyles[size]]}>{icon}</Text>}
      <Text
        style={[
          styles.text,
          sizeTextStyles[size],
          isOutline && styles.textOutline,
          isGhost && styles.textGhost,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
