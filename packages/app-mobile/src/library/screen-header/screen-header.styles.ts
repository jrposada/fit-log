import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

const HEADER_FIXED_HEIGHT = 52;

export const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.headerBackground,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    minHeight: HEADER_FIXED_HEIGHT,
    gap: spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.headerText,
  },
  titleContainer: {
    flexShrink: 1,
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: 4,
  },
  extra: {
    marginLeft: spacing.sm,
  },
});

export { HEADER_FIXED_HEIGHT };
