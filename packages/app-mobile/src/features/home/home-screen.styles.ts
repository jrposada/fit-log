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
});
