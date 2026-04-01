import { StyleSheet } from 'react-native';

import {
  ink,
  radii,
  semantic,
  shadows,
  spacing,
  surfaces,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surfaces.page,
  },
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  selectionTitle: {
    ...typography.heading,
    color: ink.primary,
    marginBottom: spacing['3xl'],
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: surfaces.base,
    borderRadius: radii.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    width: '100%',
    ...shadows.cardElevated,
  },
  selectionIcon: {
    fontSize: 32,
    marginRight: spacing.lg,
  },
  selectionButtonText: {
    ...typography.title,
    fontWeight: '500',
    color: ink.primary,
  },
  selectionButtonDisabled: {
    opacity: 0.5,
  },
  selectionButtonTextDisabled: {
    color: ink.disabled,
  },
  permissionHint: {
    ...typography.caption,
    color: semantic.error,
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  },
});
