import { StyleSheet } from 'react-native';

import { radii, spacing } from '../theme';

export type SwatchSize = 'sm' | 'md' | 'lg';
export type SwatchShape = 'square' | 'round';

export const sizeStyles = StyleSheet.create({
  sm: { width: spacing.sm, height: spacing.sm },
  md: { width: spacing.md, height: spacing.md },
  lg: { width: spacing.lg, height: spacing.lg },
});

export const shapeStyles = StyleSheet.create({
  square: { borderRadius: radii.xs },
  round: { borderRadius: radii.full },
});
