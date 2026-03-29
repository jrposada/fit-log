import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textHeading,
    marginBottom: spacing.xs,
  },
  editButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  editButtonText: {
    fontSize: 13,
    color: '#2962ff',
    fontWeight: '500',
  },
  selectWrapper: {
    marginBottom: spacing.sm,
  },
  infoContainer: {
    backgroundColor: colors.screenBackground,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTextContainer: {
    flex: 1,
  },
  selectedStats: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  placeholderText: {
    fontSize: 15,
    color: colors.textDisabled,
  },
});
