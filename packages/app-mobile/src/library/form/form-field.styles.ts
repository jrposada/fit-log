import { StyleSheet } from 'react-native';

import { ink, semantic, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: ink.primary,
    marginBottom: spacing.sm,
  },
  required: {
    color: semantic.error,
  },
  helperText: {
    ...typography.caption,
    color: ink.tertiary,
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: semantic.error,
    marginTop: spacing.xs,
  },
});
