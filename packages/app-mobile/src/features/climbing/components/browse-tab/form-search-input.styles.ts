import { StyleSheet } from 'react-native';

import {
  ink,
  radii,
  shadows,
  spacing,
  surfaces,
  typography,
} from '../../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: surfaces.base,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  input: {
    flex: 1,
    height: 44,
    ...typography.body,
    color: ink.primary,
  },
  clearButton: {
    padding: spacing.sm,
  },
});
