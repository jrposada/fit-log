import { StyleSheet } from 'react-native';

import { spacing } from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  inner: {
    padding: spacing.xl,
  },
  footer: {
    padding: spacing.lg,
  },
});
