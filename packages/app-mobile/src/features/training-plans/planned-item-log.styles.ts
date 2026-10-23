import { StyleSheet } from 'react-native';

import {
  borders,
  ink,
  radii,
  spacing,
  surfaces,
  typography,
} from '../../library/theme';

export const styles = StyleSheet.create({
  setIndex: {
    minWidth: spacing.md,
  },
  input: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing['2xs'],
    ...typography.callout,
    color: ink.primary,
    backgroundColor: surfaces.base,
    textAlign: 'right',
  },
});
