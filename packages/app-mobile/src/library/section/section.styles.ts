import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../theme';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.card,
    padding: spacing.lg,
  },
  noPadding: {
    paddingHorizontal: 0,
  },
  title: {
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  titleLevel1: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  titleLevel2: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
