import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing } from '../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingBottom: 40,
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
    color: '#4CAF50',
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: radii.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    ...shadows.cardElevated,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textHeading,
  },
  primaryButtonText: {
    color: colors.textOnAction,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dividerText: {
    marginHorizontal: spacing.lg,
    color: colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: 32,
    alignItems: 'center',
  },
  createAccountButton: {
    paddingVertical: spacing.md,
  },
  createAccountText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
