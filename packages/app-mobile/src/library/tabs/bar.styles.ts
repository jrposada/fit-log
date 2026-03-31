import { StyleSheet } from 'react-native';

import { accent, ink, spacing, surfaces, typography } from '../theme';

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: surfaces.base,
    paddingTop: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: accent.primary,
  },
  tabText: {
    ...typography.callout,
    fontWeight: '600',
    color: ink.secondary,
  },
  activeTabText: {
    color: accent.primary,
  },
});
