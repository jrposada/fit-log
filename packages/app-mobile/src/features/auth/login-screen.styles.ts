import { StyleSheet } from 'react-native';

import { spacing } from '../../library/theme';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['5xl'],
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  footer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
  },
});
