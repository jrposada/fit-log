import { StyleSheet } from 'react-native';

import { radii, spacing } from '../../../../library/theme';

export const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.badge,
  },
});
