import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: spacing.sm,
  },
  required: {
    color: '#ff3b30',
  },
  helperText: {
    fontSize: 12,
    color: colors.textDisabled,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: 12,
    color: '#ff3b30',
    marginTop: spacing.xs,
  },
});
