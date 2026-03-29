import { StyleSheet } from 'react-native';

import { colors, spacing } from '../../library/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
    marginTop: 10,
    color: colors.textHeading,
  },
  cardsContainer: {
    gap: 15,
  },
  card: {
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
