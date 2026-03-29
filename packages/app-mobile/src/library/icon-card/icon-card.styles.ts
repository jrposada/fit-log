import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export const styles = StyleSheet.create({
  layout: {
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  icon: {
    fontSize: 40,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  descriptionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
