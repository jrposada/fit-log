import { StyleSheet } from 'react-native';

import { ink, radii, spacing, surfaces, typography } from '../theme';

export const styles = StyleSheet.create({
  base: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: surfaces.sunken,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: ink.primary,
  },
  expandIcon: {
    fontSize: 12,
    color: ink.secondary,
  },
});
