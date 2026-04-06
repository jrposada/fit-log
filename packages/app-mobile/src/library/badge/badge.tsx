import { FunctionComponent } from 'react';
import { Text, View } from 'react-native';

import { BadgeVariant, styles, variantStyles } from './badge.styles';

export interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

const Badge: FunctionComponent<BadgeProps> = ({ label, variant }) => {
  const v = variantStyles[variant];

  return (
    <View style={[styles.base, v.container]}>
      <Text style={[styles.text, v.text]}>{label}</Text>
    </View>
  );
};

export default Badge;
