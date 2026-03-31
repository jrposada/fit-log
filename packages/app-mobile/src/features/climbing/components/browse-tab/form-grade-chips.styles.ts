import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  ink,
  spacing,
  typography,
} from '../../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.callout,
    fontWeight: '600',
    color: ink.secondary,
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
    backgroundColor: borders.default,
  },
  chipSelected: {
    backgroundColor: accent.primary,
  },
  chipText: {
    ...typography.callout,
    color: ink.primary,
  },
  chipTextSelected: {
    color: ink.inverse,
  },
});
