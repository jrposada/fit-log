import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  ink,
  radii,
  spacing,
  surfaces,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  mapPlaceholder: {
    borderWidth: 2,
    borderColor: borders.subtle,
    borderStyle: 'dashed',
    borderRadius: radii.card,
    padding: spacing['3xl'],
    alignItems: 'center',
    backgroundColor: surfaces.raised,
  },
  mapPlaceholderIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  mapPlaceholderText: {
    ...typography.body,
    color: ink.secondary,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: radii.card,
    padding: spacing.lg,
    backgroundColor: surfaces.base,
  },
  locationCardContent: {
    flex: 1,
  },
  locationAddress: {
    ...typography.body,
    color: accent.primary,
    marginBottom: spacing.xs,
  },
  locationCoords: {
    ...typography.caption,
    color: ink.tertiary,
  },
  changeButton: {
    ...typography.body,
    fontWeight: '500',
    color: accent.primary,
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
    ...typography.callout,
    color: ink.secondary,
  },
});
