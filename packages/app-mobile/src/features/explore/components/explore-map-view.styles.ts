import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  radii,
  spacing,
  surfaces,
} from '../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: surfaces.base,
    borderWidth: 2,
    borderColor: accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinSelected: {
    backgroundColor: accent.primary,
  },
  detailCard: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: surfaces.raised,
    borderWidth: 1,
    borderColor: borders.default,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  detailStatsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: borders.default,
  },
  detailStat: {},
  startSessionContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
  },
  startSessionButton: {
    borderRadius: radii.full,
    paddingHorizontal: spacing['2xl'],
  },
});
