import { StyleSheet } from 'react-native';

import { spacing, surfaces } from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surfaces.page,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  footer: {
    backgroundColor: surfaces.base,
    padding: spacing.lg,
  },
});
