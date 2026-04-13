import { FunctionComponent } from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import {
  sizeStyles,
  sizeTextStyles,
  styles,
  variantStyles,
  variantTextColors,
} from './icon-button.styles';

type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'destructive';
type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  rounded?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const IconButton: FunctionComponent<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  rounded = false,
  color,
  style,
}) => {
  const resolvedColor = disabled
    ? undefined
    : (color ?? variantTextColors[variant]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        rounded && styles.rounded,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          sizeTextStyles[size],
          disabled && styles.disabledText,
          resolvedColor ? { color: resolvedColor } : undefined,
        ]}
      >
        {icon}
      </Text>
    </Pressable>
  );
};

export default IconButton;
