import { FunctionComponent } from 'react';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { Icon, IconSize } from '../icon';
import {
  sizeIconGapStyles,
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
  fullWidth?: boolean;
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const buttonSizeToIconSize: Record<
  NonNullable<ButtonProps['size']>,
  IconSize
> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const Button: FunctionComponent<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
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
        fullWidth && styles.fullWidth,
        icon && styles.baseWithIcon,
        icon && sizeIconGapStyles[size],
        { backgroundColor: variantColors[variant] },
        isOutline && styles.outline,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <Icon icon={icon} size={buttonSizeToIconSize[size]} />}
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
