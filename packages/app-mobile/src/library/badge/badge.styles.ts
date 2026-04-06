import { StyleSheet } from 'react-native';

import { accent, radii, semantic, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  base: {
    borderRadius: radii.badge,
  },
  text: {
    fontWeight: '700',
  },
});

const sizeStyles = {
  sm: {
    container: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
    },
    text: typography.overline,
  },
  md: {
    container: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    text: typography.callout,
  },
} as const;

export type BadgeSize = keyof typeof sizeStyles;

export { sizeStyles };

const variantStyles = {
  success: {
    container: { backgroundColor: 'rgba(27, 94, 32, 0.12)' },
    text: { color: semantic.success },
  },
  info: {
    container: { backgroundColor: 'rgba(33, 150, 243, 0.12)' },
    text: { color: accent.primary },
  },
} as const;

export type BadgeVariant = keyof typeof variantStyles;

export { variantStyles };
