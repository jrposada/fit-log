import { StyleSheet } from 'react-native';

import { accent, ink, radii, semantic, surfaces, typography } from '../theme';

export const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: surfaces.sunken,
  },
  primary: {
    backgroundColor: accent.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: semantic.destructive,
  },
});

export const variantTextColors = {
  default: undefined,
  primary: ink.inverse,
  ghost: undefined,
  destructive: ink.inverse,
} as const;

// Square dimensions matching Button effective heights
export const sizeStyles = StyleSheet.create({
  sm: { width: 28, height: 28, borderRadius: radii.sm },
  md: { width: 38, height: 38, borderRadius: radii.button },
  lg: { width: 54, height: 54, borderRadius: radii.button },
});

export const sizeTextStyles = StyleSheet.create({
  sm: { fontSize: typography.callout.fontSize },
  md: { fontSize: typography.body.fontSize },
  lg: { fontSize: typography.body.fontSize },
});

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rounded: {
    borderRadius: 9999,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: surfaces.sunken,
  },
  disabledText: {
    color: ink.disabled,
  },
  label: {
    fontWeight: '600',
  },
});
