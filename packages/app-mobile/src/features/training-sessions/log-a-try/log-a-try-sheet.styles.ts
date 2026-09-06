import { StyleSheet } from 'react-native';

import {
  borders,
  ink,
  radii,
  spacing,
  typography,
} from '../../../library/theme';

export const styles = StyleSheet.create({
  notesInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: borders.default,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: ink.primary,
  },
});
