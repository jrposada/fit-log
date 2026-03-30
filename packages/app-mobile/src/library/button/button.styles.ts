import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing } from '../theme';

export const variantColors = {
  primary: colors.actionPrimary,
  success: colors.actionSuccess,
  destructive: colors.actionDestructive,
  warning: colors.actionWarning,
  info: colors.actionInfo,
  outline: colors.cardBackground,
  ghost: 'transparent',
} as const;

export const sizeStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.button,
  },
  lg: {
    padding: spacing.lg,
    borderRadius: radii.button,
  },
});

export const sizeTextStyles = StyleSheet.create({
  sm: {
    fontSize: 13,
  },
  md: {
    fontSize: 15,
  },
  lg: {
    fontSize: 16,
  },
});

export const sizeIconStyles = StyleSheet.create({
  sm: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  md: {
    fontSize: 17,
    marginRight: spacing.sm,
  },
  lg: {
    fontSize: 20,
    marginRight: spacing.md,
  },
});

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
  },
  baseWithIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  outline: {
    borderRadius: radii.card,
    ...shadows.cardElevated,
  },
  text: {
    color: colors.textOnAction,
    fontWeight: '600',
  },
  textOutline: {
    color: colors.textHeading,
  },
  textGhost: {
    color: colors.headerBackground,
  },
  icon: {},
});
