import { FunctionComponent } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import Card from '../card';
import { styles } from './icon-card.styles';

export interface IconCardProps {
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  variant?: 'stat' | 'description';
  style?: StyleProp<ViewStyle>;
}

const IconCard: FunctionComponent<IconCardProps> = ({
  icon,
  color,
  title,
  subtitle,
  onPress,
  variant = 'stat',
  style,
}) => {
  return (
    <Card
      variant="elevatedStrong"
      highlight={color}
      onPress={onPress}
      style={[styles.layout, styles[`layout--${variant}`], style]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={[styles.content, styles[`content--${variant}`]]}>
        <Text style={[styles.title]}>{title}</Text>
        <Text style={[styles.subtitle, { color }]}>{subtitle}</Text>
      </View>
    </Card>
  );
};

export default IconCard;
