import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../theme';

export const styles = StyleSheet.create({
  mapPlaceholder: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radii.card,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  mapPlaceholderIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: spacing.lg,
    backgroundColor: colors.cardBackground,
  },
  locationCardContent: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 16,
    color: colors.actionPrimary,
    marginBottom: spacing.xs,
  },
  locationCoords: {
    fontSize: 12,
    color: colors.textDisabled,
  },
  changeButton: {
    fontSize: 16,
    color: colors.actionPrimary,
    fontWeight: '500',
  },
  locationCardReadonly: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  mapPreviewContainer: {},
  mapPreviewPressed: {
    opacity: 0.7,
  },
  mapPreviewMapContainer: {
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  mapPreview: {
    height: 180,
  },
  mapPreviewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPreviewHint: {
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
