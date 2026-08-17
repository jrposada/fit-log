import { StyleSheet } from 'react-native';

import {
  accent,
  borders,
  ink,
  radii,
  shadows,
  spacing,
  surfaces,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: surfaces.raised,
    borderWidth: 1,
    borderColor: borders.default,
    borderRadius: radii.lg,
    padding: spacing['2xs'],
    gap: spacing['2xs'],
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  activeTab: {
    backgroundColor: surfaces.base,
    ...shadows.glow,
  },
  tabText: {
    ...typography.caption,
    color: ink.secondary,
  },
  activeTabText: {
    color: accent.primary,
  },
});
