import { StyleSheet } from 'react-native';

import { ink, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  base: {
    padding: spacing['4xl'],
    alignItems: 'center',
  },
  text: {
    ...typography.body,
    color: ink.secondary,
    textAlign: 'center',
  },
});
