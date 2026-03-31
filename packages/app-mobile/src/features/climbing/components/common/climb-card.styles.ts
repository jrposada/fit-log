import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing } from '../../../../library/theme';

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
    backgroundColor: colors.cardBackground,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  contextText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  metaText: {
    fontSize: 12,
    color: colors.textDisabled,
  },
  metaDot: {
    fontSize: 12,
    color: colors.textDisabled,
  },
  // Status badges
  badgeBase: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeSend: {
    backgroundColor: 'rgba(27, 94, 32, 0.12)',
  },
  badgeTextSend: {
    color: colors.actionSuccess,
  },
  badgeFlash: {
    backgroundColor: 'rgba(27, 94, 32, 0.12)',
  },
  badgeTextFlash: {
    color: colors.actionSuccess,
  },
  badgeProject: {
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
  },
  badgeTextProject: {
    color: colors.actionInfo,
  },
  // Swipe actions
  rightActions: {
    width: ACTION_BUTTON_WIDTH,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: colors.actionSuccess,
    justifyContent: 'center',
    alignItems: 'center',
    width: ACTION_BUTTON_WIDTH,
    borderTopRightRadius: radii.card,
    borderBottomRightRadius: radii.card,
  },
  actionText: {
    color: colors.textOnAction,
    fontSize: 14,
    fontWeight: '600',
  },
  leftActions: {
    width: ACTION_BUTTON_WIDTH,
    flexDirection: 'row',
  },
  projectActionButton: {
    backgroundColor: colors.actionInfo,
    justifyContent: 'center',
    alignItems: 'center',
    width: ACTION_BUTTON_WIDTH,
    borderTopLeftRadius: radii.card,
    borderBottomLeftRadius: radii.card,
  },
});

export const ACTION_WIDTH = ACTION_BUTTON_WIDTH;
