import { FunctionComponent } from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { styles } from './icon-button.styles';

export interface IconButtonProps {
  icon: string;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  backgroundColor?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const IconButton: FunctionComponent<IconButtonProps> = ({
  icon,
  onPress,
  size = 40,
  iconSize = 20,
  backgroundColor = '#f0f0f0',
  color,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { fontSize: iconSize }, color && { color }]}>
        {icon}
      </Text>
    </Pressable>
  );
};

export default IconButton;
