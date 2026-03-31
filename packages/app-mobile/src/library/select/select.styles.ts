import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  ink,
  radii,
  spacing,
  surfaces,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  valueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: surfaces.base,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: borders.subtle,
  },
  valueButtonClearable: {
    paddingRight: 40,
  },
  valueText: {
    ...typography.body,
    flex: 1,
    color: ink.primary,
  },
  valueClearButton: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  valueClearButtonText: {
    ...typography.heading,
    color: ink.tertiary,
  },
  placeholderText: {
    color: ink.tertiary,
  },
  valueReadonly: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: radii.md,
    padding: spacing.md,
    paddingRight: 40,
    ...typography.body,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  clearButtonText: {
    ...typography.heading,
    color: ink.tertiary,
  },
  listView: {
    height: 300,
  },
  listContent: {
    flexGrow: 1,
  },
  dropdownItem: {
    height: 48,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
  },
  selectedItem: {
    backgroundColor: accent.subtle,
  },
  dropdownItemText: {
    ...typography.body,
    color: ink.primary,
  },
  selectedItemText: {
    color: accent.primary,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.callout,
    color: ink.tertiary,
  },
  addButton: {
    backgroundColor: accent.primary,
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
    alignSelf: 'stretch',
  },
  addButtonText: {
    ...typography.body,
    color: ink.inverse,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
  },
  closeButtonText: {
    ...typography.body,
    color: accent.primary,
    fontWeight: '600',
  },
});
