import { StyleSheet } from 'react-native';

import { ink, spacing, surfaces, typography } from '../theme';

const HEADER_FIXED_HEIGHT = 52;

export const styles = StyleSheet.create({
  header: {
    backgroundColor: surfaces.base,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    minHeight: HEADER_FIXED_HEIGHT,
    gap: spacing.md,
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  titleText: {
    ...typography.title,
    color: ink.primary,
  },
  titleContainer: {
    flexShrink: 1,
  },
  subtitleText: {
    ...typography.callout,
    color: ink.secondary,
    marginTop: 4,
  },
  extra: {
    marginLeft: spacing.sm,
  },
});

export { HEADER_FIXED_HEIGHT };
