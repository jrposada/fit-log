import { StyleSheet } from 'react-native';

import { ink, radii, semantic, shadows, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.screenPadding,
    right: spacing.screenPadding,
    zIndex: 9999,
    gap: spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.card,
    padding: spacing.md,
    borderLeftWidth: 4,
    ...shadows.card,
  },
  toastSuccess: {
    backgroundColor: semantic.successMuted,
    borderLeftColor: semantic.success,
  },
  toastDestructive: {
    backgroundColor: semantic.destructiveMuted,
    borderLeftColor: semantic.error,
  },
  toastMessage: {
    ...typography.callout,
    color: ink.primary,
    flex: 1,
  },
  dismissButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  dismissText: {
    ...typography.callout,
    fontWeight: '600',
    color: ink.secondary,
  },
});
