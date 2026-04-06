import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  radii,
  semantic,
  spacing,
  surfaces,
} from '../../../../library/theme';

export const styles = StyleSheet.create({
  addSectorButton: {
    borderWidth: 2,
    borderColor: accent.primary,
    borderRadius: radii.button,
    padding: spacing.lg,
    alignItems: 'center',
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
  deleteButton: {
    backgroundColor: semantic.error,
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
  imagesContainer: {
    marginTop: spacing.md,
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
});
