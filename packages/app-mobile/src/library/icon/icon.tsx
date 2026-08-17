import { MaterialIcons } from '@expo/vector-icons';
import { ComponentProps, FunctionComponent } from 'react';
import { StyleProp, TextStyle } from 'react-native';

import { ink, spacing as spacingTokens } from '../theme';
import { IconSize, SIZE_MAP } from './icon.styles';

type SpacingToken = keyof typeof spacingTokens;

/** A functional glyph name from the MaterialIcons set (e.g. "home", "explore", "close"). */
export type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface IconProps {
  icon: IconName;
  size?: IconSize;
  color?: string;
  spacer?: SpacingToken;
  style?: StyleProp<TextStyle>;
}

const Icon: FunctionComponent<IconProps> = ({
  icon,
  size = 'md',
  color = ink.primary,
  spacer,
  style,
}) => {
  return (
    <MaterialIcons
      name={icon}
      size={SIZE_MAP[size]}
      color={color}
      style={[
        spacer != null ? { marginBottom: spacingTokens[spacer] } : undefined,
        style,
      ]}
    />
  );
};

export default Icon;
