import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    alignItems: 'center',
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
