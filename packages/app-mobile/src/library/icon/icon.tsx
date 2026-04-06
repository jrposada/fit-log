import { FunctionComponent } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { spacing as spacingTokens } from '../theme';
import { IconSize, SIZE_MAP, styles } from './icon.styles';

type SpacingToken = keyof typeof spacingTokens;

export interface IconProps {
  icon: string;
  size?: IconSize;
  color?: string;
  spacer?: SpacingToken;
  style?: StyleProp<TextStyle>;
}

const Icon: FunctionComponent<IconProps> = ({
  icon,
  size = 'md',
  color,
  spacer,
  style,
}) => {
  return (
    <Text
      style={[
        styles.base,
        { fontSize: SIZE_MAP[size] },
        color ? { color } : undefined,
        spacer != null ? { marginBottom: spacingTokens[spacer] } : undefined,
        style,
      ]}
    >
      {icon}
    </Text>
  );
};

export default Icon;
