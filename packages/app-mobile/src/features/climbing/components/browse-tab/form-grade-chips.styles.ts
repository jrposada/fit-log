import { StyleSheet } from 'react-native';

import { accent, borders, spacing } from '../../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: borders.default,
  },
  chipSelected: {
    backgroundColor: accent.primary,
  },
});
