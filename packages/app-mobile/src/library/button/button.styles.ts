import { StyleSheet } from 'react-native';

import {
  accent,
  ink,
  radii,
  semantic,
  shadows,
  spacing,
  surfaces,
  typography,
} from '../theme';

export const variantColors = {
  primary: accent.primary,
  success: semantic.success,
  destructive: semantic.destructive,
  warning: semantic.warning,
  info: accent.primary,
  outline: surfaces.base,
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
    ...typography.callout,
  },
  md: {
    ...typography.body,
  },
  lg: {
    ...typography.body,
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
    backgroundColor: ink.disabled,
    opacity: 0.6,
  },
  outline: {
    borderRadius: radii.card,
    ...shadows.cardElevated,
  },
  text: {
    color: ink.inverse,
    fontWeight: '600',
  },
  textOutline: {
    color: ink.primary,
  },
  textGhost: {
    color: accent.primary,
  },
});
