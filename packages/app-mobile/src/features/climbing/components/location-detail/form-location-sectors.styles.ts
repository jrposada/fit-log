import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  ink,
  radii,
  semantic,
  spacing,
  surfaces,
  typography,
} from '../../../../library/theme';

export const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.body,
    fontWeight: '500',
    color: ink.primary,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.callout,
    color: ink.secondary,
    marginBottom: spacing.md,
  },
  addSectorButton: {
    borderWidth: 2,
    borderColor: accent.primary,
    borderRadius: radii.button,
    padding: spacing.lg,
    alignItems: 'center',
  },
  addSectorButtonText: {
    ...typography.body,
    fontWeight: '500',
    color: accent.primary,
  },
  sectorsList: {
    marginBottom: spacing.md,
  },
  sectorItem: {
    padding: spacing.md,
    backgroundColor: surfaces.page,
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
    ...typography.callout,
    color: ink.secondary,
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
    backgroundColor: accent.primary,
  },
  actionButtonText: {
    ...typography.callout,
    fontWeight: '500',
    color: ink.inverse,
  },
  deleteButton: {
    backgroundColor: semantic.error,
  },
  deleteButtonText: {
    color: ink.inverse,
  },
  restoreButton: {
    backgroundColor: accent.primary,
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
    backgroundColor: surfaces.base,
    borderRadius: radii.card,
    padding: spacing['2xl'],
    alignItems: 'center',
    minWidth: 200,
  },
  uploadingText: {
    marginTop: spacing.md,
    ...typography.body,
    color: ink.primary,
  },
  imagesContainer: {
    marginTop: spacing.md,
  },
  imagesLabel: {
    ...typography.callout,
    fontWeight: '500',
    color: ink.primary,
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
    backgroundColor: borders.default,
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
    borderColor: borders.subtle,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageIcon: {
    ...typography.display,
    color: ink.secondary,
  },
});
