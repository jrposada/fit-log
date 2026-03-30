import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../theme';

export const styles = StyleSheet.create({
  valueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  valueButtonClearable: {
    paddingRight: 40,
  },
  valueText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
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
    fontSize: 20,
    color: colors.textDisabled,
    fontWeight: '600',
  },
  placeholderText: {
    color: colors.textDisabled,
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
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    padding: spacing.md,
    paddingRight: 40,
    fontSize: 16,
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
    fontSize: 20,
    color: colors.textDisabled,
    fontWeight: '600',
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
    backgroundColor: '#e3f2fd',
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.textHeading,
  },
  selectedItemText: {
    color: colors.actionInfo,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textDisabled,
  },
  addButton: {
    backgroundColor: colors.actionInfo,
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
    alignSelf: 'stretch',
  },
  addButtonText: {
    color: colors.textOnAction,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
  },
  closeButtonText: {
    color: colors.actionInfo,
    fontSize: 16,
    fontWeight: '600',
  },
});
