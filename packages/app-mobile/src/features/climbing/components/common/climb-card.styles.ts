import { StyleSheet } from 'react-native';

import {
  accent,
  radii,
  semantic,
  shadows,
  spacing,
  surfaces,
} from '../../../../library/theme';

export const SWIPE_COLORS = {
  rightBase: semantic.success,
  rightEmphasis: accent.emphasis,
  leftBase: accent.primary,
  leftEmphasis: accent.emphasis,
} as const;

export const styles = StyleSheet.create({
  card: {
    backgroundColor: surfaces.base,
    borderRadius: radii.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.card,
  },
  cardLoading: {
    opacity: 0.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
