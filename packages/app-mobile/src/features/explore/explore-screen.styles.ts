import { StyleSheet } from 'react-native';

import { borders, spacing, surfaces } from '../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surfaces.page,
  },
  filterHeader: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: borders.default,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  content: {
    flex: 1,
  },
});
