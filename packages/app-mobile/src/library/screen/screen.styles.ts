import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  footer: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
