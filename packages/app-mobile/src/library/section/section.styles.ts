import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../theme';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.card,
    padding: spacing.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});
