import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  radii,
  spacing,
  surfaces,
} from '../../../library/theme';

export const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: borders.default,
    backgroundColor: surfaces.raised,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipActive: {
    borderColor: accent.primary,
    backgroundColor: surfaces.base,
  },
});
