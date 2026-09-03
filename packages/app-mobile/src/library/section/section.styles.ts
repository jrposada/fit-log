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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    flexShrink: 1,
  },
  titleLevel1: {
    ...typography.caption,
    color: ink.secondary,
  },
  titleLevel2: {
    ...typography.callout,
    fontWeight: '600',
    color: ink.secondary,
  },
});
