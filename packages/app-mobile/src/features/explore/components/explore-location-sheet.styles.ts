import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  ink,
  radii,
  spacing,
  surfaces,
  typography,
} from '../../../library/theme';

export const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: surfaces.raised,
    borderWidth: 1,
    borderColor: borders.default,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: ink.primary,
  },
  list: {
    maxHeight: 320,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    marginBottom: spacing['2xs'],
  },
  rowSelected: {
    backgroundColor: surfaces.raised,
    borderWidth: 1,
    borderColor: accent.primary,
  },
  createButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: borders.default,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
  },
});
