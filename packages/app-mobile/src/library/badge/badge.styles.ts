import { StyleSheet } from 'react-native';

import { accent, radii, semantic, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.badge,
  },
  text: {
    ...typography.overline,
    fontWeight: '700',
  },
});

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
