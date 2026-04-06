import { FunctionComponent } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { IconSize, SIZE_MAP, styles } from './icon.styles';

export interface IconProps {
  icon: string;
  size?: IconSize;
  color?: string;
  style?: StyleProp<TextStyle>;
}

const Icon: FunctionComponent<IconProps> = ({
  icon,
  size = 'md',
  color,
  style,
}) => {
  return (
    <Text
      style={[
        styles.base,
        { fontSize: SIZE_MAP[size] },
        color ? { color } : undefined,
        style,
      ]}
    >
      {icon}
    </Text>
  );
};

export default Icon;
