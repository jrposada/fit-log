import { StyleSheet } from 'react-native';

import { borders, ink, radii, spacing, surfaces, typography } from '../theme';

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
  textArea: {
    minHeight: 100,
  },
  inputReadonly: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: undefined,
  },
});
