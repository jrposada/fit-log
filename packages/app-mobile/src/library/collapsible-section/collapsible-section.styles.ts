import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../theme';

export const styles = StyleSheet.create({
  base: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textHeading,
  },
  expandIcon: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
