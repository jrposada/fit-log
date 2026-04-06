import { StyleSheet } from 'react-native';

import { ink, radii, spacing, typography } from '../theme';

export const ACTION_WIDTH = 72;

export const styles = StyleSheet.create({
  container: {
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  swipeableRow: {
    overflow: 'visible',
  },
  swipeBackgroundRight: {
    flex: 1,
    borderRadius: radii.card,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: spacing.lg,
  },
  swipeBackgroundLeft: {
    flex: 1,
    borderRadius: radii.card,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: spacing.lg,
  },
  swipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  swipeLabel: {
    ...typography.callout,
    fontWeight: '600',
    color: ink.inverse,
  },
  swipeIcon: {
    fontSize: 20,
    color: ink.inverse,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});
