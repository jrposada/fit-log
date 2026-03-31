import { StyleSheet } from 'react-native';

import { ink, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  base: {
    height: 1,
    alignSelf: 'stretch',
  },
  line: {
    flex: 1,
    height: 1,
  },
  labeled: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    ...typography.callout,
    marginHorizontal: spacing.lg,
    color: ink.secondary,
  },
});
