import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.screenBackground,
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  holdsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hold: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderWidth: 2,
    borderColor: colors.cardBackground,
    marginLeft: -12,
    marginTop: -12,
  },
  noImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: colors.textDisabled,
  },
  footer: {
    padding: spacing.lg,
  },
  descriptionSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: colors.actionDestructive,
    borderRadius: radii.button,
    padding: spacing.lg,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.textOnAction,
    fontSize: 16,
    fontWeight: '600',
  },
});
