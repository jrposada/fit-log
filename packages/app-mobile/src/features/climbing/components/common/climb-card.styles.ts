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
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
});
