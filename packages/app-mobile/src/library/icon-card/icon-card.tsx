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
      style={[styles.layout, style]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.content}>
        {variant === 'stat' ? (
          <>
            <Text style={styles.statTitle}>{title}</Text>
            <Text style={[styles.statSubtitle, { color }]}>{subtitle}</Text>
          </>
        ) : (
          <>
            <Text style={[styles.descriptionTitle, { color }]}>{title}</Text>
            <Text style={styles.descriptionSubtitle}>{subtitle}</Text>
          </>
        )}
      </View>
    </Card>
  );
};

export default IconCard;
