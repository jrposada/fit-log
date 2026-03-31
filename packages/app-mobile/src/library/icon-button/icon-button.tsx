import { FunctionComponent } from 'react';
import { Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { ink, semantic, surfaces } from '../theme';
import { styles } from './icon-button.styles';

type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<IconButtonSize, { box: number; icon: number }> = {
  xs: { box: 22, icon: 12 },
  sm: { box: 32, icon: 16 },
  md: { box: 40, icon: 20 },
  lg: { box: 44, icon: 24 },
};

export interface IconButtonProps {
  icon: string;
  onPress: () => void;
  variant?: 'default' | 'ghost' | 'destructive';
  size?: IconButtonSize;
  backgroundColor?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const IconButton: FunctionComponent<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'default',
  size = 'md',
  backgroundColor = surfaces.sunken,
  color,
  style,
}) => {
  const { box, icon: iconFontSize } = SIZE_MAP[size];

  const resolvedBg =
    variant === 'destructive' ? semantic.destructive : backgroundColor;
  const resolvedColor =
    color ?? (variant === 'destructive' ? ink.inverse : undefined);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        variant === 'ghost'
          ? { width: box, height: box }
          : {
              width: box,
              height: box,
              borderRadius: box / 2,
              backgroundColor: resolvedBg,
            },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { fontSize: iconFontSize },
          resolvedColor ? { color: resolvedColor } : undefined,
        ]}
      >
        {icon}
      </Text>
    </Pressable>
  );
};

export default IconButton;
