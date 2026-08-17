import { StyleSheet } from 'react-native';

import {
  borders,
  ink,
  radii,
  semantic,
  spacing,
  surfaces,
  typography,
} from '../theme';

export const variantStyles = StyleSheet.create({
  success: {
    backgroundColor: surfaces.base,
    borderColor: semantic.success,
  },
  destructive: {
    backgroundColor: surfaces.base,
    borderColor: semantic.error,
  },
});

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
    borderWidth: 1,
    borderColor: borders.default,
    borderLeftWidth: 4,
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
});
