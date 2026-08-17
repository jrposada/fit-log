import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { FunctionComponent } from 'react';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';

import {
  borderStyles,
  sizeIconGapStyles,
  sizeStyles,
  sizeTextStyles,
  styles,
  variantColors,
  variantTextStyles,
} from './button.styles';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: keyof typeof variantColors;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: string;
  /** Icon glyph set. "material" (default) uses the app's functional icon set; "brand" renders third-party logos (Google, Apple sign-in). */
  iconFamily?: 'material' | 'brand';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ICON_SIZE_PX: Record<NonNullable<ButtonProps['size']>, number> = {
  sm: 16,
  md: 20,
  lg: 20,
};

const Button: FunctionComponent<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  icon,
  iconFamily = 'material',
  disabled = false,
  style,
}) => {
  const isOutline = variant === 'outline';
  const isDestructive = variant === 'destructive';

  const textStyle = variantTextStyles[variant];
  const IconComponent = iconFamily === 'brand' ? AntDesign : MaterialIcons;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyles[size],
        fullWidth && styles.fullWidth,
        icon && styles.baseWithIcon,
        icon && sizeIconGapStyles[size],
        { backgroundColor: variantColors[variant] },
        isOutline && borderStyles.outline,
        isDestructive && borderStyles.destructive,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && (
        <IconComponent
          name={icon as never}
          size={ICON_SIZE_PX[size]}
          color={textStyle.color}
        />
      )}
      <Text style={[styles.text, sizeTextStyles[size], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
