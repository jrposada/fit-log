import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: colors.textHeading,
  },
  customButton: {
    marginTop: spacing.sm,
    backgroundColor: '#2962ff',
    paddingVertical: 14,
    borderRadius: radii.lg,
    alignItems: 'center',
  },
  customButtonText: {
    color: colors.textOnAction,
    fontSize: 16,
    fontWeight: '600',
  },
});
