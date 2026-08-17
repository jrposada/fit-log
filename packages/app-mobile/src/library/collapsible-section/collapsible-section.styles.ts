import { StyleSheet } from 'react-native';

import { borders, ink, radii, spacing, surfaces, typography } from '../theme';

export const styles = StyleSheet.create({
  base: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: surfaces.sunken,
    borderWidth: 1,
    borderColor: borders.default,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.callout,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: ink.secondary,
  },
});
