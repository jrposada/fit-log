import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../theme';

export const variantColors = {
  primary: colors.actionPrimary,
  success: colors.actionSuccess,
  destructive: colors.actionDestructive,
  warning: colors.actionWarning,
  info: colors.actionInfo,
} as const;

export const styles = StyleSheet.create({
  base: {
    borderRadius: radii.button,
    padding: spacing.lg,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  text: {
    color: colors.textOnAction,
    fontSize: 16,
    fontWeight: '600',
  },
});
