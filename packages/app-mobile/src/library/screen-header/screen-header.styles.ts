import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

const HEADER_FIXED_HEIGHT = 52;

export const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.headerBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    minHeight: HEADER_FIXED_HEIGHT,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.headerText,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.headerText,
    flexShrink: 1,
  },
  extra: {
    marginLeft: spacing.sm,
  },
});

export { HEADER_FIXED_HEIGHT };
