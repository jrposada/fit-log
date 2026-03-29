import { FunctionComponent } from 'react';
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { styles, variantColors } from './button.styles';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: keyof typeof variantColors;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: FunctionComponent<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: variantColors[variant] },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
