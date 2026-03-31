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
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sector: {
    fontSize: 13,
    color: colors.textSecondary,
  },
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
});

export const ACTION_WIDTH = ACTION_BUTTON_WIDTH;
