import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  radii,
  spacing,
  surfaces,
  typography,
} from '../../../library/theme';

export const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: surfaces.overlay,
    borderTopWidth: 1,
    borderTopColor: borders.default,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing['2xs'],
    borderRadius: radii.full,
  },
  tabActive: {
    backgroundColor: accent.primary,
  },
  label: {
    ...typography.caption,
    textTransform: 'none',
  },
});
