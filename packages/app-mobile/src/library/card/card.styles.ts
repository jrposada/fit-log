import { StyleSheet } from 'react-native';

import { ink, radii, shadows, spacing, surfaces, typography } from '../theme';

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

export const ACTION_WIDTH = 72;

export const styles = StyleSheet.create({
  base: {
    backgroundColor: surfaces.base,
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
    backgroundColor: surfaces.page,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  // Swipe styles
  swipeContainer: {
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  swipeableRow: {
    overflow: 'visible',
  },
  swipeBackgroundRight: {
    flex: 1,
    borderRadius: radii.card,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: spacing.lg,
  },
  swipeBackgroundLeft: {
    flex: 1,
    borderRadius: radii.card,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: spacing.lg,
  },
  swipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  swipeLabel: {
    ...typography.callout,
    fontWeight: '600',
    color: ink.inverse,
  },
  swipeIcon: {
    fontSize: 20,
    color: ink.inverse,
  },
});
