import { FunctionComponent } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import Card from '../card';
import { IconName } from '../icon';
import Icon from '../icon/icon';
import { ink } from '../theme';
import { styles } from './icon-card.styles';

export interface IconCardProps {
  icon: IconName;
  /** Icon tint for the "description" variant's chip. Ignored by "stat" (always neutral). */
  color?: string;
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
  if (variant === 'stat') {
    return (
      <Card
        variant="flat"
        onPress={onPress}
        style={[styles.layout, styles['layout--stat'], style]}
      >
        <Icon icon={icon} size="md" color={ink.secondary} />
        <View style={[styles.content, styles['content--stat']]}>
          <Text style={[styles.title, styles['title--stat']]}>{title}</Text>
          <Text style={[styles.subtitle, styles['subtitle--stat']]}>
            {subtitle}
          </Text>
        </View>
      </Card>
    );
  }

  const chipColor = color ?? ink.secondary;

  return (
    <Card
      variant="flat"
      onPress={onPress}
      style={[styles.layout, styles['layout--description'], style]}
    >
      <View style={[styles.iconChip, { borderColor: chipColor }]}>
        <Icon icon={icon} size="md" color={chipColor} />
      </View>
      <View style={[styles.content, styles['content--description']]}>
        <Text style={[styles.title, styles['title--description']]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, styles['subtitle--description']]}>
          {subtitle}
        </Text>
      </View>
    </Card>
  );
};

export default IconCard;
