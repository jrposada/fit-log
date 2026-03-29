import { StyleSheet } from 'react-native';

import { spacing } from '../theme';

export const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFECB5',
  },
  text: {
    color: '#664D03',
    fontSize: 13,
    textAlign: 'center',
  },
});
