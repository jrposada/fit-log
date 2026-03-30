import { FunctionComponent, PropsWithChildren } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

import { highlightWidths, sizeStyles, styles } from './card.styles';

export interface CardProps {
  variant?: 'elevated' | 'elevatedStrong' | 'flat' | 'subdued';
  direction?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  highlight?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const Card: FunctionComponent<PropsWithChildren<CardProps>> = ({
  variant = 'elevated',
  direction = 'vertical',
  size = 'md',
  highlight,
  onPress,
  style,
  children,
}) => {
  const cardStyle = [
    styles.base,
    sizeStyles[size],
    styles[variant],
    direction === 'horizontal' && styles.horizontal,
    highlight !== undefined && {
      borderLeftColor: highlight,
      borderLeftWidth: highlightWidths[size],
    },
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
