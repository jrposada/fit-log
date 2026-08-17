import { StyleSheet } from 'react-native';

import { dataTypography, ink, radii, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  layout: {
    alignItems: 'center',
  },
  ['layout--stat']: {
    flexDirection: 'column',
    gap: spacing.xs,
  },
  ['layout--description']: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },

  iconChip: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    display: 'flex',
    gap: spacing['2xs'],
  },
  ['content--stat']: {
    alignItems: 'center',
  },
  ['content--description']: {},

  title: {},
  ['title--stat']: {
    ...typography.caption,
    color: ink.secondary,
  },
  ['title--description']: {
    ...typography.body,
    fontWeight: '600',
    color: ink.primary,
  },

  subtitle: {},
  ['subtitle--stat']: {
    ...dataTypography.lg,
    color: ink.primary,
  },
  ['subtitle--description']: {
    ...dataTypography.sm,
    color: ink.secondary,
  },
});
