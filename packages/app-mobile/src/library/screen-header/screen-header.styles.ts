import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  action: {
    minWidth: 60,
  },
  actionRight: {
    alignItems: 'flex-end',
  },
  actionLeft: {
    alignItems: 'flex-start',
  },
});
