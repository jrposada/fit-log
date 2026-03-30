import { StyleSheet } from 'react-native';

import { colors, spacing } from '../../library/theme';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.headerBackground,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  footer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
  },
});
