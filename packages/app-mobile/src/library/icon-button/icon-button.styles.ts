import { StyleSheet } from 'react-native';

import { IconSize } from '../icon';
import { accent, ink, radii, semantic, surfaces } from '../theme';

export const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: surfaces.sunken,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: {
    backgroundColor: accent.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: semantic.destructive,
  },
});

export const variantTextColors = {
  default: ink.primary,
  primary: ink.inverse,
  ghost: ink.primary,
  destructive: semantic.destructive,
} as const;

// Square dimensions matching Button effective heights
export const sizeStyles = StyleSheet.create({
  sm: { width: 28, height: 28, borderRadius: radii.sm },
  md: { width: 38, height: 38, borderRadius: radii.button },
  lg: { width: 54, height: 54, borderRadius: radii.button },
});

export const ICON_SIZE_MAP: Record<'sm' | 'md' | 'lg', IconSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

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
});
