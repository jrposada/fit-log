import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../theme';

export const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    color: '#000',
    backgroundColor: colors.cardBackground,
  },
  inputError: {
    borderColor: '#ff3b30',
  },
});
