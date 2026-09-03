import { StyleSheet, TextStyle } from 'react-native';

import {
  accent,
  borders,
  ink,
  radii,
  semantic,
  spacing,
  typography,
} from '../theme';

export const variantColors = {
  primary: accent.primary,
  success: semantic.success,
  destructive: 'transparent',
  warning: semantic.warning,
  info: accent.secondary,
  outline: 'transparent',
  ghost: 'transparent',
  secondaryGhost: 'transparent',
} as const;

export const variantTextStyles: Record<keyof typeof variantColors, TextStyle> =
  {
    primary: { color: ink.inverse },
    success: { color: ink.inverse },
    destructive: { color: semantic.destructive },
    warning: { color: ink.inverse },
    info: { color: accent.onSecondary },
    outline: { color: ink.primary },
    ghost: { color: accent.primary },
    secondaryGhost: { color: accent.secondary },
  };

export const borderStyles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    borderColor: borders.default,
  },
  destructive: {
    borderWidth: 1,
    borderColor: semantic.destructive,
  },
});

export const sizeStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.button,
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

export const sizeIconGapStyles = StyleSheet.create({
  sm: { gap: spacing.xs },
  md: { gap: spacing.sm },
  lg: { gap: spacing.sm },
});

export const sizeTextStyles = StyleSheet.create({
  sm: {
    ...typography.callout,
    textTransform: 'none',
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
  fullWidth: {
    flex: 1,
  },
  disabled: {
    backgroundColor: ink.disabled,
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
  },
});
