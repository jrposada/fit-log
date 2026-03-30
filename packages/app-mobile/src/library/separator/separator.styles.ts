import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

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
    marginHorizontal: spacing.lg,
    color: colors.textSecondary,
    fontSize: 14,
  },
});
