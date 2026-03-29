import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  footer: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.actionPrimary,
    borderRadius: radii.card,
    padding: spacing.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.textOnAction,
    fontSize: 18,
    fontWeight: '600',
  },
  unsavedBanner: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFECB5',
  },
  unsavedBannerText: {
    color: '#664D03',
    fontSize: 13,
    textAlign: 'center',
  },
});
