import { FunctionComponent, PropsWithChildren } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

import { styles } from './card.styles';

export interface CardProps {
  variant?: 'elevated' | 'elevatedStrong' | 'flat';
  borderLeftColor?: string;
  borderLeftWidth?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const Card: FunctionComponent<PropsWithChildren<CardProps>> = ({
  variant = 'elevated',
  borderLeftColor,
  borderLeftWidth = 4,
  onPress,
  style,
  children,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    borderLeftColor !== undefined && { borderLeftColor, borderLeftWidth },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} activeOpacity={0.7} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

export default Card;
