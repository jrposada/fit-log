import { StyleSheet } from 'react-native';

import { ink, radii, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  base: {
    height: 1,
    alignSelf: 'stretch',
    borderRadius: radii.full,
  },
  vertical: {
    width: 1,
    alignSelf: 'stretch',
    borderRadius: radii.full,
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
  dot: {
    ...typography.caption,
    color: ink.tertiary,
  },
});
