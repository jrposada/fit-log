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

export const styles = StyleSheet.create({
  base: {
    borderRadius: radii.button,
    padding: spacing.lg,
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
    fontSize: 16,
    fontWeight: '600',
  },
  textOutline: {
    color: colors.textHeading,
  },
  textGhost: {
    color: colors.headerBackground,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
});
