import { StyleSheet } from 'react-native';

import { ink, spacing, typography } from '../../library/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
  },
  title: {
    ...typography.display,
    marginBottom: spacing.xl,
    marginTop: spacing.md,
    color: ink.primary,
  },
  cardsContainer: {
    gap: spacing.lg,
  },
});
