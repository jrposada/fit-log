import { StyleSheet } from 'react-native';

import { colors, spacing } from '../../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.actionInfo,
  },
  chipText: {
    fontSize: 14,
    color: colors.textHeading,
  },
  chipTextSelected: {
    color: colors.textOnAction,
  },
});
