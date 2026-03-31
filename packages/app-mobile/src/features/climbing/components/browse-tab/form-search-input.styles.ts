import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing } from '../../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.textHeading,
  },
  clearButton: {
    padding: spacing.sm,
  },
  clearButtonText: {
    fontSize: 20,
    color: colors.textDisabled,
  },
});
