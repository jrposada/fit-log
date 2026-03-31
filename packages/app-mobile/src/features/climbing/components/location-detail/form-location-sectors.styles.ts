import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../../../library/theme';

export const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  addSectorButton: {
    borderWidth: 2,
    borderColor: colors.actionPrimary,
    borderRadius: radii.button,
    padding: spacing.lg,
    alignItems: 'center',
  },
  addSectorButtonText: {
    fontSize: 16,
    color: colors.actionPrimary,
    fontWeight: '500',
  },
  sectorsList: {
    marginBottom: spacing.md,
  },
  sectorItem: {
    padding: spacing.md,
    backgroundColor: colors.screenBackground,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  sectorMainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  sectorTextContainer: {
    flex: 1,
  },
  sectorDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.actionPrimary,
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.textOnAction,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    color: colors.textOnAction,
  },
  restoreButton: {
    backgroundColor: colors.actionPrimary,
  },
  sectorItemDeleted: {
    opacity: 0.4,
  },
  imageDeleted: {
    opacity: 0.4,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  uploadingContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.card,
    padding: spacing.xxl,
    alignItems: 'center',
    minWidth: 200,
  },
  uploadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: '#000',
  },
  imagesContainer: {
    marginTop: spacing.md,
  },
  imagesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: spacing.sm,
  },
  imagesScroll: {
    flexDirection: 'row',
  },
  imagesScrollContent: {
    paddingTop: spacing.sm,
    paddingRight: spacing.sm,
  },
  imageWrapper: {
    marginRight: spacing.sm,
    position: 'relative',
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: radii.md,
    backgroundColor: colors.border,
  },
  deleteImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    zIndex: 1,
  },
  addImageTile: {
    width: 100,
    height: 100,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageIcon: {
    fontSize: 28,
    color: colors.textSecondary,
  },
});
