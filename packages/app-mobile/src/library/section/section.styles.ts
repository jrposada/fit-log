import { StyleSheet } from 'react-native';

import { ink, radii, spacing, surfaces, typography } from '../theme';

export const styles = StyleSheet.create({
  base: {
    borderRadius: radii.card,
    padding: spacing.lg,
  },
  filled: {
    backgroundColor: surfaces.base,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  title: {
    marginBottom: spacing.sm,
  },
  titleLevel1: {
    ...typography.body,
    fontWeight: '600',
    color: ink.primary,
  },
  titleLevel2: {
    ...typography.callout,
    fontWeight: '600',
    color: ink.secondary,
  },
});
