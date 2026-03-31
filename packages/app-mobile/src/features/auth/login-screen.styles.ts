import { StyleSheet } from 'react-native';

import { accent, ink, spacing, typography } from '../../library/theme';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['5xl'],
  },
  logoText: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: accent.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body,
    color: ink.secondary,
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  footer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
  },
});
