import { StyleSheet } from 'react-native';

import { ink, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  layout: {
    alignItems: 'center',
  },
  ['layout--stat']: {
    flexDirection: 'column',
  },
  ['layout--description']: {
    flexDirection: 'row',
  },

  icon: {
    fontSize: 40,
  },

  content: {
    flex: 1,

    display: 'flex',

    gap: spacing.xs,
  },
  ['content--stat']: {
    alignItems: 'center',
  },
  ['content--description']: {},

  title: {},
  ['title--stat']: {
    ...typography.callout,
    color: ink.secondary,
  },
  ['title--description']: {
    ...typography.heading,
    fontWeight: 'bold',
  },

  subtitle: {},
  ['subtitle--stat']: {
    ...typography.display,
    fontWeight: 'bold',
  },
  ['subtitle--description']: {
    ...typography.callout,
    color: ink.secondary,
  },
});
