import { StyleSheet } from 'react-native';

import { ink, radii, spacing, typography } from '../../../../library/theme';

export const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.badge,
  },
  text: {
    ...typography.callout,
    fontWeight: 'bold',
    color: ink.inverse,
  },
});
