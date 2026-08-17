import { FunctionComponent } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';

import { IconName } from '../icon';
import Icon from '../icon/icon';
import { ink } from '../theme';
import {
  ICON_SIZE_MAP,
  sizeStyles,
  styles,
  variantStyles,
  variantTextColors,
} from './icon-button.styles';

type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'destructive';
type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  icon: IconName;
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
    ? ink.disabled
    : (color ?? variantTextColors[variant] ?? ink.primary);

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
      <Icon icon={icon} size={ICON_SIZE_MAP[size]} color={resolvedColor} />
    </Pressable>
  );
};

export default IconButton;
