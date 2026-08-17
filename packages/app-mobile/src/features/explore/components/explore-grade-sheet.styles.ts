import { StyleSheet } from 'react-native';

import { spacing } from '../../../library/theme';

export const styles = StyleSheet.create({
  scroll: {
    maxHeight: 360,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
