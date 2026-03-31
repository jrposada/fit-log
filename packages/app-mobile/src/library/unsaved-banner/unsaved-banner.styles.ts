import { StyleSheet } from 'react-native';

import { semantic, spacing, typography } from '../theme';

export const styles = StyleSheet.create({
  banner: {
    backgroundColor: semantic.warningSubtle,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: semantic.warning,
  },
  text: {
    ...typography.callout,
    color: semantic.warning,
    textAlign: 'center',
  },
});
