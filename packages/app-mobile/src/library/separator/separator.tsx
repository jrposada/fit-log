import { FunctionComponent } from 'react';
import { Text, View } from 'react-native';

import { borders, ink, spacing } from '../theme';
import { styles } from './separator.styles';

type SpacingToken = keyof typeof spacing;

const sizeValues = {
  sm: 1,
  md: 2,
  lg: 4,
} as const;

const variantColors = {
  subtle: borders.subtle,
  default: borders.default,
  strong: ink.primary,
} as const;

export interface SeparatorProps {
  direction?: 'horizontal' | 'vertical' | 'dot';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'subtle' | 'default' | 'strong';
  inset?: SpacingToken;
  label?: string;
}

const Separator: FunctionComponent<SeparatorProps> = ({
  direction = 'horizontal',
  size = 'sm',
  variant = 'default',
  inset,
  label,
}) => {
  const thickness = sizeValues[size];
  const color = variantColors[variant];
  const insetValue = inset != null ? spacing[inset] : 0;

  if (direction === 'dot') {
    return <Text style={styles.dot}>·</Text>;
  }

  const isVertical = direction === 'vertical';
  const marginStyle = isVertical
    ? { marginVertical: insetValue }
    : { marginHorizontal: insetValue };

  if (label) {
    return (
      <View style={[styles.labeled, marginStyle]}>
        <View style={[styles.line, { backgroundColor: color }]} />
        <Text style={styles.labelText}>{label}</Text>
        <View style={[styles.line, { backgroundColor: color }]} />
      </View>
    );
  }

  if (isVertical) {
    return (
      <View
        style={[
          styles.vertical,
          { width: thickness, backgroundColor: color },
          marginStyle,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.base,
        { height: thickness, backgroundColor: color },
        marginStyle,
      ]}
    />
  );
};

export default Separator;
