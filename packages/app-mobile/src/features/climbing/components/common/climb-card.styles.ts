import { StyleSheet } from 'react-native';

import {
  accent,
  ink,
  radii,
  semantic,
  shadows,
  spacing,
  surfaces,
  typography,
} from '../../../../library/theme';

const ACTION_BUTTON_WIDTH = 72;

export const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  swipeableRow: {
    overflow: 'visible',
  },
  card: {
    backgroundColor: surfaces.base,
    borderRadius: radii.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.card,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardLoading: {
    opacity: 0.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: ink.primary,
    flex: 1,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  contextText: {
    ...typography.callout,
    color: ink.secondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  metaText: {
    ...typography.caption,
    color: ink.tertiary,
  },
  metaDot: {
    ...typography.caption,
    color: ink.tertiary,
  },
  // Status badges
  badgeBase: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    ...typography.overline,
    fontWeight: '700',
  },
  badgeSend: {
    backgroundColor: 'rgba(27, 94, 32, 0.12)',
  },
  badgeTextSend: {
    color: semantic.success,
  },
  badgeFlash: {
    backgroundColor: 'rgba(27, 94, 32, 0.12)',
  },
  badgeTextFlash: {
    color: semantic.success,
  },
  badgeProject: {
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
  },
  badgeTextProject: {
    color: accent.primary,
  },
  // Swipe actions
  rightActions: {
    width: ACTION_BUTTON_WIDTH,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: semantic.success,
    justifyContent: 'center',
    alignItems: 'center',
    width: ACTION_BUTTON_WIDTH,
    borderTopRightRadius: radii.card,
    borderBottomRightRadius: radii.card,
  },
  actionText: {
    ...typography.callout,
    fontWeight: '600',
    color: ink.inverse,
  },
  leftActions: {
    width: ACTION_BUTTON_WIDTH,
    flexDirection: 'row',
  },
  projectActionButton: {
    backgroundColor: accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: ACTION_BUTTON_WIDTH,
    borderTopLeftRadius: radii.card,
    borderBottomLeftRadius: radii.card,
  },
});

export const ACTION_WIDTH = ACTION_BUTTON_WIDTH;
