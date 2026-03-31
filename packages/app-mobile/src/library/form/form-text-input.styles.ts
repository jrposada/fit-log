import { StyleSheet } from 'react-native';

import {
  borders,
  ink,
  radii,
  semantic,
  spacing,
  surfaces,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: borders.subtle,
    borderRadius: radii.md,
    padding: spacing.md,
    ...typography.body,
    color: ink.primary,
    backgroundColor: surfaces.base,
  },
  inputError: {
    borderColor: semantic.error,
  },
  inputReadonly: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
