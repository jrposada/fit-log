import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  ink,
  radii,
  spacing,
  surfaces,
  typography,
} from '../theme';

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

export const ACTION_WIDTH = 72;

export const styles = StyleSheet.create({
  base: {
    backgroundColor: surfaces.base,
    borderRadius: radii.card,
  },
  noPadding: {
    padding: 0,
  },
  /** Mild "active" emphasis without full commitment. */
  elevated: {
    borderWidth: 1,
    borderColor: borders.default,
  },
  /** Live/selected states (active session, selected map pin). */
  elevatedStrong: {
    borderWidth: 1,
    borderColor: accent.primary,
  },
  /** Standard flat card — 1px outline instead of a shadow. */
  flat: {
    borderWidth: 1,
    borderColor: borders.default,
  },
  subdued: {
    backgroundColor: surfaces.sunken,
    borderWidth: 1,
    borderColor: borders.default,
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
    backgroundColor: surfaces.base,
    borderRadius: radii.card,
  },
  swipeInner: {
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
