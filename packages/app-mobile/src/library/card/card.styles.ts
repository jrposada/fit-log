import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing } from '../theme';

export const sizeStyles = StyleSheet.create({
  sm: {
    padding: spacing.sm,
  },
  md: {
    padding: spacing.md,
  },
  lg: {
    padding: spacing.lg,
  },
});

export const highlightWidths = {
  sm: 2,
  md: 4,
  lg: 6,
} as const;

export const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.card,
  },
  elevated: {
    ...shadows.card,
  },
  elevatedStrong: {
    ...shadows.cardElevated,
  },
  flat: {},
  subdued: {
    backgroundColor: colors.screenBackground,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.7,
  },
});
