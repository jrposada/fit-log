import { StyleSheet } from 'react-native';

import { ink, spacing, typography } from '../theme';

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
    ...typography.callout,
    color: ink.secondary,
    marginBottom: spacing.xs,
  },
  statSubtitle: {
    ...typography.display,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    ...typography.heading,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  descriptionSubtitle: {
    ...typography.callout,
    color: ink.secondary,
  },
});
